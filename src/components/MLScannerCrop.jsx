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

const MIN_OCR_INTERVAL = 1200
const MAX_OCR_INTERVAL = 2500

export default function MLScannerCrop({ onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const ocrTimerRef = useRef(null);
  const lastOcrRef = useRef(0);
  const stableTextRef = useRef("");

  const barcodeRef = useRef(null);
  const [barcode, setBarcode] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const preprocessImage = (sourceCanvas, sourceCtx) => {
    const w = sourceCanvas.width
    const h = sourceCanvas.height
    const minW = 800
    const scale = w < minW ? minW / w : 1
    const targetW = Math.round(w * scale)
    const targetH = Math.round(h * scale)

    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = targetW
    tempCanvas.height = targetH
    const tempCtx = tempCanvas.getContext("2d")

    tempCtx.filter = 'contrast(1.4) brightness(1.1) saturate(0)'
    tempCtx.drawImage(sourceCanvas, 0, 0, w, h, 0, 0, targetW, targetH)

    return tempCanvas
  }

  const isFrameUsable = (ctx, w, h) => {
    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data
    let total = 0
    let count = 0
    for (let i = 0; i < data.length; i += 16) {
      total += data[i] + data[i + 1] + data[i + 2]
      count += 3
    }
    const avg = total / count
    const variance = data.slice(0, data.length).reduce((acc, v) => acc + Math.abs(v - avg), 0) / data.length
    return variance > 15
  }

  const runOCR = useCallback(async () => {
    const now = Date.now();
    if (now - lastOcrRef.current < MIN_OCR_INTERVAL) return;
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

    if (!isFrameUsable(canvas, canvas.width, canvas.height)) {
      setIsScanning(false);
      return;
    }

    const { x, y, w, h } = cropConfig;
    const cropX = canvas.width * x;
    const cropY = canvas.height * y;
    const cropW = canvas.width * w;
    const cropH = canvas.height * h;

    cropCanvas.width = cropW;
    cropCanvas.height = cropH;

    const cropCtx = cropCanvas.getContext("2d");
    cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const processed = preprocessImage(cropCanvas, cropCtx);

    try {
      const { data: { text } } = await Tesseract.recognize(processed, "spa", {
        logger: () => {},
      });
      if (text && text.trim() && text.trim() !== ocrText) {
        setOcrText(text);
        onScan({ barcode: barcodeRef.current, ocrText: text });
      }
    } catch (_) {}

    setIsScanning(false);
  }, [onScan]);

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
    }, MAX_OCR_INTERVAL);

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