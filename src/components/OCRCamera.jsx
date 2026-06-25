import { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import './OCRCamera.css'

export default function OCRCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [texto, setTexto] = useState("");
  const [procesando, setProcesando] = useState(false);

  // Inicializar cámara
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const capturarYLeer = async () => {
    if (!videoRef.current) return;

    setProcesando(true);
    setTexto("Procesando...");

    // Dibujar frame del video en un canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convertir canvas a imagen
    const dataURL = canvas.toDataURL("image/png");

    // Procesar con Tesseract
    const result = await Tesseract.recognize(dataURL, "spa", {
      logger: (m) => console.log(m),
    });

    setTexto(result.data.text);
    setProcesando(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>OCR desde cámara con Tesseract</h2>

      <video
        ref={videoRef}
        autoPlay
        className="ocr-video"
      />

      <button
        onClick={capturarYLeer}
        disabled={procesando}
        className="ocr-btn"
      >
        {procesando ? "Leyendo..." : "Capturar y leer texto"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <pre
        className="ocr-result"
      >
        {texto}
      </pre>
    </div>
  );
}