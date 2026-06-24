import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

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
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          border: "2px solid #ccc",
        }}
      />

      <p>
        <strong>Código detectado:</strong> {codigo}
      </p>
    </div>
  );
}