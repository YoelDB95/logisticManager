import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Tesseract from "tesseract.js";
import './MLScannerCrop.css'

const cropConfig = {
  x: 0.08,
  y: 0.20,
  w: 0.84,
  h: 0.60
};

export default function MLScannerCrop() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);

  const [barcode, setBarcode] = useState(null);
  const [ocrText, setOcrText] = useState("");

  const runOCR = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cropCanvas = cropCanvasRef.current;

    if (!video || video.readyState !== 4) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const { x, y, w, h } = cropConfig;
    const cropX = canvas.width * x;
    const cropY = canvas.height * y;
    const cropW = canvas.width * w;
    const cropH = canvas.height * h;

    cropCanvas.width = cropW;
    cropCanvas.height = cropH;

    const cropCtx = cropCanvas.getContext("2d");
    cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const imgData = cropCanvas.toDataURL("image/png");

    const { data: { text } } = await Tesseract.recognize(imgData, "spa");
    setOcrText(text);
  }, []);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    const video = videoRef.current;

    reader.decodeFromVideoDevice(
      null,
      video,
      (result) => {
        if (result) {
          setBarcode(result.getText());
        }
      }
    );

    return () => {
      try { reader.reset(); } catch (_) {}
      if (video && video.srcObject) {
        const stream = video.srcObject;
        try { stream.getTracks().forEach(track => track.stop()); } catch (_) {}
        video.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!barcode) return;

    const interval = setInterval(() => {
      runOCR();
    }, 1500);

    return () => clearInterval(interval);
  }, [barcode, runOCR]);

  return (
    <div className="scanner-wrap">
      <h2 className="scanner-title">Escanear Etiqueta</h2>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
        />

        <div
          className="crop-overlay"
          style={{
            left: `${cropConfig.x * 100}%`,
            top: `${cropConfig.y * 100}%`,
            width: `${cropConfig.w * 100}%`,
            height: `${cropConfig.h * 100}%`,
          }}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={cropCanvasRef} style={{ display: "none" }} />

      <div className="scanner-result">
        {!barcode ? (
          <div className="scanner-status-wrapper">
            <div className="scanner-status-icon waiting" aria-hidden="true">
              <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="scanner-status-text">Enfoca el código de barras en el recuadro verde</p>
          </div>
        ) : (
          <>
            <div className="scanner-result-box">
              <p className="scanner-result-label">Código de barras</p>
              <pre className="scanner-result-value">{barcode}</pre>
            </div>
            <div className="scanner-result-box">
              <p className="scanner-result-label">Texto detectado (OCR)</p>
              <pre className={`scanner-result-value${!ocrText || ocrText === 'Procesando...' ? ' empty' : ''}`}>{ocrText || 'Procesando...'}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
