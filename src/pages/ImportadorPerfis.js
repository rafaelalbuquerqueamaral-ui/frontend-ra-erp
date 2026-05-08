import React, { useState } from "react";

export default function ImportadorPerfis() {
  const [arquivo, setArquivo] = useState(null);

  async function importar() {
    if (!arquivo) {
      alert("Selecione um CSV");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
      const r = await fetch("http://localhost:3001/importar-perfis", {
        method: "POST",
        body: formData,
      });

      const data = await r.json();

      alert(data.mensagem || "Perfis importados!");
    } catch (err) {
      console.log(err);
      alert("Erro ao importar");
    }
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1>IMPORTADOR DE PERFIS</h1>

      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          width: 500,
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setArquivo(e.target.files[0])}
        />

        <button
          onClick={importar}
          style={{
            marginTop: 20,
            background: "#003b7a",
            color: "#fff",
            border: 0,
            padding: 15,
            borderRadius: 10,
            width: "100%",
            fontWeight: "bold",
          }}
        >
          IMPORTAR PERFIS
        </button>
      </div>
    </div>
  );
}