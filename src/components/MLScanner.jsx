import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import './MLScanner.css'

export default function MLScanner() {
  const videoRef = useRef(null);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const video = videoRef.current;

    codeReader
      .decodeFromVideoDevice(null, video, (result) => {
        if (result) {
          setCodigo(result.getText());
        }
      })
      .catch((err) => console.error(err));

    return () => {
      codeReader.reset();
      if (video && video.srcObject) {
        const stream = video.srcObject;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <h2>Escáner Mercado Libre</h2>
      <video
        ref={videoRef}
        className="scanner-video"
      />

      <div className="scanner-result">
        <h3>Código detectado:</h3>
        <pre>{codigo || "Esperando..."}</pre>
      </div>
    </div>
  );
}
