import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Tesseract from "tesseract.js";

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

  const crop = cropConfig;

  // --- 1. DEFINIR runOCR ANTES de cualquier useEffect ---
  const runOCR = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cropCanvas = cropCanvasRef.current;

    if (!video || video.readyState !== 4) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const cropX = canvas.width * crop.x;
    const cropY = canvas.height * crop.y;
    const cropW = canvas.width * crop.w;
    const cropH = canvas.height * crop.h;

    cropCanvas.width = cropW;
    cropCanvas.height = cropH;

    const cropCtx = cropCanvas.getContext("2d");
    cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const imgData = cropCanvas.toDataURL("image/png");

    const { data: { text } } = await Tesseract.recognize(imgData, "spa");
    setOcrText(text);

  }, []); // AHORA NO FALTAN DEPENDENCIAS


  // --- 2. Activar cámara + ZXing ---
  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    reader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result) => {
        if (result) {
          setBarcode(result.getText());
        }
      }
    );

    return () => reader.reset;
  }, []);


  // --- 3. Llamar a runOCR cuando hay un barcode ---
  useEffect(() => {
    if (!barcode) return;

    const interval = setInterval(() => {
      runOCR();
    }, 1500);

    return () => clearInterval(interval);
  }, [barcode, runOCR]); // <--- ahora sí se puede incluir runOCR


  return (
    <div style={{ padding: 20 }}>
      <h2>Escáner ML con Recorte OCR</h2>

      <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", borderRadius: 8 }}
        />

        {/* Marco de recorte */}
        <div
          style={{
            position: "absolute",
            border: "2px solid #00ff88",
            boxShadow: "0 0 10px #00ff88",
            left: `${crop.x * 100}%`,
            top: `${crop.y * 100}%`,
            width: `${crop.w * 100}%`,
            height: `${crop.h * 100}%`,
            pointerEvents: "none"
          }}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={cropCanvasRef} style={{ display: "none" }} />

      <div style={{ marginTop: 20 }}>
        <h3>Código detectado:</h3>
        <pre>{barcode || "Esperando..."}</pre>

        <h3>Texto OCR (solo recorte):</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {ocrText || "Procesando..."}
        </pre>
      </div>
    </div>
  );
}
