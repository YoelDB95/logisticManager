import { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";

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
        style={{ width: "50%", borderRadius: "12px" }}
      />

      <button
        onClick={capturarYLeer}
        disabled={procesando}
        style={{
          marginTop: 10,
          padding: 10,
          background: procesando ? "#aaa" : "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {procesando ? "Leyendo..." : "Capturar y leer texto"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <pre
        style={{
          marginTop: 20,
          background: "#eee",
          padding: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {texto}
      </pre>
    </div>
  );
}