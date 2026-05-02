import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function TipologiasPage() {
  const [tipologias, setTipologias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco_base: "",
    imagem_url: ""
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
      console.error(error);
      alert("Erro ao carregar tipologias");
    }
  }

  function limpar() {
    setEditandoId(null);
    setForm({
      nome: "",
      descricao: "",
      preco_base: "",
      imagem_url: ""
    });
  }

  function editar(t) {
    setEditandoId(t.id);
    setForm({
      nome: t.nome || "",
      descricao: t.descricao || "",
      preco_base: t.preco_base || "",
      imagem_url: t.imagem_url || ""
    });
  }

  function selecionarImagem(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (evento) {
      setForm((prev) => ({
        ...prev,
        imagem_url: evento.target.result
      }));
    };

    reader.readAsDataURL(file);
  }

  async function salvar(e) {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      preco_base: Number(form.preco_base || 0),
      imagem_url: form.imagem_url
    };

    let res;

    if (editandoId) {
      res = await fetch(`${API}/tipologias/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API}/tipologias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar tipologia");
      return;
    }

    limpar();
    carregar();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Cadastro de Tipologias</h1>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
        <div style={box}>
          <h2 style={{ marginTop: 0 }}>
            {editandoId ? "Editar Tipologia" : "Nova Tipologia"}
          </h2>

          <form onSubmit={salvar}>
            <input
              style={input}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <input
              style={input}
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />

            <input
              style={input}
              type="number"
              step="0.01"
              placeholder="Preço base"
              value={form.preco_base}
              onChange={(e) => setForm({ ...form, preco_base: e.target.value })}
            />

            <label style={labelArquivo}>Escolher imagem da pasta do computador</label>
            <input
              style={{ marginBottom: 12 }}
              type="file"
              accept="image/*"
              onChange={selecionarImagem}
            />

            {form.imagem_url && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={form.imagem_url}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    background: "#fff"
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button style={button} type="submit">
                {editandoId ? "Atualizar Tipologia" : "Salvar Tipologia"}
              </button>

              <button
                type="button"
                style={buttonSecondary}
                onClick={limpar}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Lista de Tipologias</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {tipologias.map((t) => (
              <div
                key={t.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                  background: "#fff"
                }}
              >
                {t.imagem_url ? (
                  <img
                    src={t.imagem_url}
                    alt={t.nome}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "contain",
                      borderRadius: 8,
                      background: "#f8fafc",
                      marginBottom: 10
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 8,
                      background: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10
                    }}
                  >
                    Sem imagem
                  </div>
                )}

                <div style={{ fontWeight: "bold", fontSize: 16 }}>{t.nome}</div>
                <div style={{ color: "#475569", marginTop: 4 }}>{t.descricao}</div>
                <div style={{ marginTop: 8 }}>
                  <strong>Preço base:</strong> R$ {Number(t.preco_base || 0).toFixed(2)}
                </div>

                <button
                  style={{ ...button, marginTop: 10 }}
                  onClick={() => editar(t)}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const box = {
  background: "#fff",
  borderRadius: 12,
  padding: 16
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  boxSizing: "border-box",
  borderRadius: 6,
  border: "1px solid #ccc"
};

const labelArquivo = {
  display: "block",
  marginBottom: 8,
  fontWeight: "bold"
};

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

const buttonSecondary = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#64748b",
  color: "#fff",
  cursor: "pointer"
};