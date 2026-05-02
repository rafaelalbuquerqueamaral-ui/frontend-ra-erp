import { useState } from "react";
import API from "../config";

export default function ImportarBiblioteca() {
  const [tipo, setTipo] = useState("perfis");
  const [arquivos, setArquivos] = useState([]);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null);

  function selecionarArquivos(e) {
    setArquivos(Array.from(e.target.files || []));
  }

  async function importar() {
    if (arquivos.length === 0) {
      alert("Selecione uma pasta ou imagens");
      return;
    }

    setImportando(true);
    setResultado(null);

    const formData = new FormData();

    arquivos.forEach((arquivo) => {
      formData.append("arquivos", arquivo);
    });

    try {
      const res = await fetch(API + "/importar-biblioteca/" + tipo, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Erro: " + data.erro);
        return;
      }

      setResultado(data);
      alert("Importação concluída ✅");
    } catch {
      alert("Erro ao conectar no backend");
    } finally {
      setImportando(false);
    }
  }

  return (
    <div style={page}>
      <div style={topo}>
        <div>
          <h1>Importar Biblioteca</h1>
          <p>Importe pastas de imagens do computador para o sistema</p>
        </div>
      </div>

      <div style={grid}>
        <section style={card}>
          <h2>Origem</h2>

          <label style={label}>Tipo de cadastro</label>
          <select style={input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="perfis">Perfis</option>
            <option value="acessorios">Acessórios</option>
            <option value="vidros">Vidros</option>
            <option value="tipologias">Tipologias</option>
          </select>

          <label style={label}>Selecionar pasta ou imagens</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={selecionarArquivos}
            webkitdirectory="true"
            directory="true"
          />

          <p style={info}>
            {arquivos.length} arquivo(s) selecionado(s)
          </p>

          <button style={btn} onClick={importar} disabled={importando}>
            {importando ? "Importando..." : "Importar Biblioteca"}
          </button>
        </section>

        <section style={card}>
          <h2>Pré-visualização</h2>

          <div style={previewGrid}>
            {arquivos.slice(0, 20).map((arq, i) => (
              <div key={i} style={previewItem}>
                <img
                  src={URL.createObjectURL(arq)}
                  alt=""
                  style={img}
                />
                <small>{arq.name}</small>
              </div>
            ))}

            {arquivos.length === 0 && (
              <p>Nenhuma imagem selecionada</p>
            )}
          </div>
        </section>
      </div>

      {resultado && (
        <section style={card}>
          <h2>Resultado</h2>
          <p>
            Importados: <b>{resultado.quantidade}</b> item(ns)
          </p>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Código</th>
                <th style={th}>Nome</th>
                <th style={th}>Imagem</th>
              </tr>
            </thead>

            <tbody>
              {resultado.cadastrados.map((item) => (
                <tr key={item.id}>
                  <td style={td}>#{item.id}</td>
                  <td style={td}>{item.codigo}</td>
                  <td style={td}>{item.nome}</td>
                  <td style={td}>
                    {item.imagem && (
                      <img src={item.imagem} alt="" style={imgTabela} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

const page = { fontFamily: "Arial" };

const topo = {
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "360px 1fr",
  gap: 20,
  marginBottom: 20,
};

const card = {
  background: "#fff",
  padding: 22,
  borderRadius: 18,
  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
  marginBottom: 20,
};

const label = {
  display: "block",
  fontWeight: "bold",
  marginBottom: 6,
  color: "#475569",
};

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  marginBottom: 15,
};

const info = {
  background: "#f1f5f9",
  padding: 12,
  borderRadius: 10,
};

const btn = {
  width: "100%",
  padding: 14,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

const previewGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: 12,
};

const previewItem = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 8,
  background: "#f8fafc",
  textAlign: "center",
};

const img = {
  width: "100%",
  height: 90,
  objectFit: "cover",
  borderRadius: 8,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  background: "#e2e8f0",
  border: "1px solid #cbd5e1",
  padding: 10,
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 10,
};

const imgTabela = {
  width: 70,
  height: 50,
  objectFit: "cover",
  borderRadius: 8,
};