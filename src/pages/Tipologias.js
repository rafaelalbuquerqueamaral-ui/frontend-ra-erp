import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Tipologias() {
  const [tipologias, setTipologias] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    linha: "Gold",
    largura_padrao: "",
    altura_padrao: "",
    observacao_tecnica: "",
    imagem: null,
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(`${API}/tipologias`);
      const data = await res.json();
      setTipologias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setTipologias([]);
    }
  }

  async function salvar(e) {
    e.preventDefault();

    if (!form.nome || !form.largura_padrao || !form.altura_padrao) {
      alert("Preencha nome, largura e altura.");
      return;
    }

    const dados = new FormData();
    dados.append("nome", form.nome);
    dados.append("linha", form.linha);
    dados.append("largura_padrao", form.largura_padrao);
    dados.append("altura_padrao", form.altura_padrao);
    dados.append("observacao_tecnica", form.observacao_tecnica);

    if (form.imagem) {
      dados.append("imagem", form.imagem);
    }

    const res = await fetch(`${API}/tipologias`, {
      method: "POST",
      body: dados,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar tipologia.");
      return;
    }

    alert("Tipologia salva com imagem!");

    setForm({
      nome: "",
      linha: "Gold",
      largura_padrao: "",
      altura_padrao: "",
      observacao_tecnica: "",
      imagem: null,
    });

    carregar();
  }

  return (
    <div style={page}>
      <h1>Tipologias PRO Visual</h1>
      <p style={{ color: "#64748b" }}>
        Cadastre tipologias com imagem, linha, medidas e observação técnica.
      </p>

      <form style={card} onSubmit={salvar}>
        <h2>Nova Tipologia</h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Nome da tipologia"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <select
            style={input}
            value={form.linha}
            onChange={(e) => setForm({ ...form, linha: e.target.value })}
          >
            <option value="Gold">Linha Gold</option>
            <option value="Suprema">Linha Suprema</option>
            <option value="Especial">Especial</option>
          </select>

          <input
            style={input}
            type="number"
            placeholder="Largura padrão mm"
            value={form.largura_padrao}
            onChange={(e) =>
              setForm({ ...form, largura_padrao: e.target.value })
            }
          />

          <input
            style={input}
            type="number"
            placeholder="Altura padrão mm"
            value={form.altura_padrao}
            onChange={(e) =>
              setForm({ ...form, altura_padrao: e.target.value })
            }
          />

          <input
            style={input}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, imagem: e.target.files[0] })
            }
          />
        </div>

        <textarea
          style={textarea}
          placeholder="Observação técnica"
          value={form.observacao_tecnica}
          onChange={(e) =>
            setForm({ ...form, observacao_tecnica: e.target.value })
          }
        />

        {form.imagem && (
          <div style={previewBox}>
            <img
              src={URL.createObjectURL(form.imagem)}
              alt="Prévia"
              style={preview}
            />
          </div>
        )}

        <button style={btn} type="submit">
          Salvar Tipologia com Imagem
        </button>
      </form>

      <div style={card}>
        <h2>Biblioteca Visual de Tipologias</h2>

        <div style={cards}>
          {tipologias.map((t) => (
            <div key={t.id} style={tipCard}>
              {t.imagem ? (
                <img
                  src={`${API}/uploads/${t.imagem}`}
                  alt={t.nome}
                  style={tipImg}
                />
              ) : (
                <div style={semImagem}>Sem imagem</div>
              )}

              <h3>{t.nome}</h3>
              <p><b>Linha:</b> {t.linha}</p>
              <p>
                <b>Medida:</b> {t.largura_padrao} x {t.altura_padrao} mm
              </p>
              <p>{t.observacao_tecnica}</p>
            </div>
          ))}
        </div>

        {tipologias.length === 0 && <p>Nenhuma tipologia cadastrada.</p>}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: 30,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 20,
  marginTop: 24,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 14,
};

const input = {
  padding: 13,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const textarea = {
  ...input,
  width: "100%",
  minHeight: 80,
  marginTop: 15,
  boxSizing: "border-box",
};

const previewBox = {
  marginTop: 20,
};

const preview = {
  width: 220,
  height: 140,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
};

const btn = {
  marginTop: 24,
  width: "100%",
  padding: 16,
  border: "none",
  borderRadius: 14,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
};

const tipCard = {
  background: "#f8fafc",
  borderRadius: 18,
  padding: 16,
  border: "1px solid #e2e8f0",
};

const tipImg = {
  width: "100%",
  height: 150,
  objectFit: "cover",
  borderRadius: 14,
  marginBottom: 12,
};

const semImagem = {
  height: 150,
  background: "#e5e7eb",
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  marginBottom: 12,
};