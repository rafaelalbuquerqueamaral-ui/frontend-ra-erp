import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";
// Quando publicar online, troque por:
// const API = "https://backend-esquadrias.onrender.com";

export default function Perfis() {
  const [perfis, setPerfis] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    nome: "",
    fabricante: "",
    linha: "Gold",
    codigo: "",
    descricao: "",
    peso_kg_m: "",
    valor_kg: "",
    cor: "",
    acabamento: "",
    observacao: "",
  });

  useEffect(() => {
    carregarPerfis();
  }, []);

  async function carregarPerfis() {
    try {
      const res = await fetch(`${API}/perfis`);
      const data = await res.json();
      setPerfis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setPerfis([]);
    }
  }

  function selecionarImagem(e) {
    const file = e.target.files[0];
    setImagem(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function salvarPerfil(e) {
    e.preventDefault();

    try {
      let caminhoImagem = "";

      if (imagem) {
        const dadosImagem = new FormData();
        dadosImagem.append("imagem", imagem);

        const resUpload = await fetch(`${API}/upload-perfil`, {
          method: "POST",
          body: dadosImagem,
        });

        const imgData = await resUpload.json();

        if (!resUpload.ok) {
          alert(imgData.erro || "Erro ao enviar imagem.");
          return;
        }

        caminhoImagem = imgData.imagem;
      }

      const res = await fetch(`${API}/perfis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          imagem: caminhoImagem,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.erro || "Erro ao salvar perfil.");
        return;
      }

      alert("Perfil salvo com imagem!");

      setForm({
        nome: "",
        fabricante: "",
        linha: "Gold",
        codigo: "",
        descricao: "",
        peso_kg_m: "",
        valor_kg: "",
        cor: "",
        acabamento: "",
        observacao: "",
      });

      setImagem(null);
      setPreview("");
      carregarPerfis();
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar perfil.");
    }
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={page}>
      <h1>Cadastro de Perfis PRO</h1>
      <p style={{ color: "#64748b" }}>
        Biblioteca visual de perfis com imagem, fabricante, linha, peso e valor por kg.
      </p>

      <form style={card} onSubmit={salvarPerfil}>
        <h2>Novo Perfil</h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Nome do perfil"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            style={input}
            placeholder="Fabricante"
            value={form.fabricante}
            onChange={(e) => setForm({ ...form, fabricante: e.target.value })}
          />

          <select
            style={input}
            value={form.linha}
            onChange={(e) => setForm({ ...form, linha: e.target.value })}
          >
            <option>Gold</option>
            <option>Suprema</option>
            <option>Integrada</option>
            <option>Especial</option>
          </select>

          <input
            style={input}
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />

          <input
            style={input}
            placeholder="Descrição técnica"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Peso kg/m"
            value={form.peso_kg_m}
            onChange={(e) => setForm({ ...form, peso_kg_m: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Valor kg"
            value={form.valor_kg}
            onChange={(e) => setForm({ ...form, valor_kg: e.target.value })}
          />

          <input
            style={input}
            placeholder="Cor"
            value={form.cor}
            onChange={(e) => setForm({ ...form, cor: e.target.value })}
          />

          <input
            style={input}
            placeholder="Acabamento"
            value={form.acabamento}
            onChange={(e) => setForm({ ...form, acabamento: e.target.value })}
          />

          <input
            style={input}
            type="file"
            accept="image/*"
            onChange={selecionarImagem}
          />
        </div>

        <textarea
          style={textarea}
          placeholder="Observação técnica"
          value={form.observacao}
          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
        />

        {preview && (
          <div style={previewBox}>
            <img src={preview} alt="Prévia" style={previewImg} />
          </div>
        )}

        <button style={btn}>Salvar Perfil com Imagem</button>
      </form>

      <div style={card}>
        <h2>Biblioteca Visual de Perfis</h2>

        <div style={cards}>
          {perfis.map((p) => (
            <div key={p.id} style={perfilCard}>
              {p.imagem ? (
                <img
                  src={`${API}${p.imagem}`}
                  alt={p.nome || p.descricao}
                  style={perfilImg}
                />
              ) : (
                <div style={semImagem}>Sem imagem</div>
              )}

              <h3>{p.nome || p.descricao}</h3>

              <p><b>Fabricante:</b> {p.fabricante || "-"}</p>
              <p><b>Linha:</b> {p.linha || "-"}</p>
              <p><b>Código:</b> {p.codigo || "-"}</p>
              <p><b>Peso:</b> {p.peso_kg_m || p.peso_kg || 0} kg/m</p>
              <p><b>Valor kg:</b> {dinheiro(p.valor_kg)}</p>
              <p><b>Cor:</b> {p.cor || p.acabamento || "-"}</p>
            </div>
          ))}
        </div>

        {perfis.length === 0 && <p>Nenhum perfil cadastrado.</p>}
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
  borderRadius: 20,
  padding: 24,
  marginTop: 22,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
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
  marginTop: 14,
  boxSizing: "border-box",
};

const btn = {
  marginTop: 18,
  padding: "15px 24px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const previewBox = {
  marginTop: 18,
};

const previewImg = {
  width: 240,
  height: 150,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18,
};

const perfilCard = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 15,
};

const perfilImg = {
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