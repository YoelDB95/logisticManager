import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Tesseract from "tesseract.js";
import './MLScannerCrop.css'

const cropConfig = {
  x: 0.15,
  y: 0.30,
  w: 0.70,
  h: 0.40
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
      reader.reset();
      if (video && video.srcObject) {
        const stream = video.srcObject;
        stream.getTracks().forEach(track => track.stop());
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
    <div style={{ padding: 20 }}>
      <h2>Escáner ML con Recorte OCR</h2>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
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
        <h3>Código detectado:</h3>
        <pre>{barcode || "Esperando..."}</pre>

        <h3>Texto OCR (solo recorte):</h3>
        <pre>{ocrText || "Procesando..."}</pre>
      </div>
    </div>
  );
}
