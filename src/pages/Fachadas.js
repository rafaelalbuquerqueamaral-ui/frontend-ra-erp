import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Fachadas() {
  const [fachadas, setFachadas] = useState([]);

  useEffect(() => {
    carregarFachadas();
  }, []);

  async function carregarFachadas() {
    try {
      const res = await fetch(`${API}/fachadas`);
      const data = await res.json();
      setFachadas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setFachadas([]);
    }
  }

  async function excluirFachada(id) {
    if (!window.confirm("Excluir esta fachada?")) return;

    await fetch(`${API}/fachadas/${id}`, {
      method: "DELETE",
    });

    carregarFachadas();
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function abrirFachada(id) {
    localStorage.setItem("fachada_abrir_id", id);
    window.location.href = "/fachada-pro";
  }

  return (
    <div style={page}>
      <h1>Histórico de Fachadas</h1>
      <p style={{ color: "#64748b" }}>
        Fachadas salvas no Neon para abrir, editar e gerar orçamento novamente.
      </p>

      <div style={card}>
        {fachadas.length === 0 && <p>Nenhuma fachada salva ainda.</p>}

        {fachadas.map((f) => {
          const orc = f.orcamento_json || {};
          const desenho = f.desenho_json || {};

          return (
            <div key={f.id} style={item}>
              <div>
                <h3>{f.nome}</h3>
                <p>
                  {f.largura_total} x {f.altura_total} mm • {f.qx} x {f.qy}
                </p>
                <p>
                  Módulos: {desenho?.grade?.flat?.().length || "-"} | Venda:{" "}
                  {dinheiro(orc.vendaTotal)}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button style={btn} onClick={() => abrirFachada(f.id)}>
                  Abrir
                </button>

                <button style={btnDanger} onClick={() => excluirFachada(f.id)}>
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const page = {
  padding: 30,
  minHeight: "100vh",
  background: "#eef2f7",
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
  marginTop: 20,
};

const item = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e5e7eb",
  padding: "18px 0",
};

const btn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: 10,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnDanger = {
  ...btn,
  background: "#dc2626",
};