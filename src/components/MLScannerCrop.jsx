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

const OCR_INTERVAL = 2500

export default function MLScannerCrop({ onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const ocrTimerRef = useRef(null);
  const lastOcrRef = useRef(0);

  const barcodeRef = useRef(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [barcode, setBarcode] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const runOCR = useCallback(async () => {
    const now = Date.now();
    if (now - lastOcrRef.current < OCR_INTERVAL) return;
    lastOcrRef.current = now;

    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cropCanvas = cropCanvasRef.current;

    if (!video || video.readyState !== 4) {
      setIsScanning(false);
      return;
    }

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
    cropCtx.filter = 'contrast(1.3) brightness(1.1)';
    cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const imgData = cropCanvas.toDataURL("image/jpeg", 0.9);

    try {
      const { data: { text } } = await Tesseract.recognize(imgData, "spa", {
        logger: () => {},
      });
      if (text && text.trim() && text.trim() !== ocrText) {
        setOcrText(text);
        onScanRef.current({ barcode: barcodeRef.current, ocrText: text });
      }
    } catch (_) {}

    setIsScanning(false);
  }, []);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    const video = videoRef.current;

    reader.decodeFromVideoDevice(
      null,
      video,
      (result) => {
        if (result) {
          barcodeRef.current = result.getText();
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
      if (ocrTimerRef.current) clearInterval(ocrTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!barcode) return;

    if (ocrTimerRef.current) clearInterval(ocrTimerRef.current);

    ocrTimerRef.current = setInterval(() => {
      runOCR();
    }, OCR_INTERVAL);

    return () => {
      if (ocrTimerRef.current) clearInterval(ocrTimerRef.current);
    };
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
          className={`crop-overlay ${isScanning ? 'scanning' : 'idle'}`}
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
            <p className="scanner-status-text">Enfoca el código de barras en el recuadro</p>
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