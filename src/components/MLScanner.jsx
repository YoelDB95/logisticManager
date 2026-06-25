import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import './MLScanner.css'

export default function MLScanner() {
  const videoRef = useRef(null);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setCodigo(result.getText());
          console.log(result);
          
        }
      })
      .catch((err) => console.error(err));

    return () => {
      codeReader.reset();
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