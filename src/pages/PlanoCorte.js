import React, { useState } from "react";

const TAMANHO_BARRA = 6000;
const PERDA_SERRA = 3;

export default function PlanoCorte() {
  const [pecas, setPecas] = useState([]);
  const [form, setForm] = useState({
    perfil: "",
    medida: "",
    quantidade: 1,
  });

  function adicionarPeca(e) {
    e.preventDefault();

    if (!form.perfil || !form.medida) {
      alert("Informe perfil e medida.");
      return;
    }

    const novas = [];

    for (let i = 0; i < Number(form.quantidade || 1); i++) {
      novas.push({
        perfil: form.perfil,
        medida: Number(form.medida),
      });
    }

    setPecas([...pecas, ...novas]);

    setForm({
      perfil: "",
      medida: "",
      quantidade: 1,
    });
  }

  function limpar() {
    setPecas([]);
  }

  function otimizarCorte() {
    const ordenadas = [...pecas].sort((a, b) => b.medida - a.medida);
    const barras = [];

    ordenadas.forEach((peca) => {
      let encaixou = false;

      for (const barra of barras) {
        const usado = barra.pecas.reduce(
          (s, p) => s + p.medida + PERDA_SERRA,
          0
        );

        if (usado + peca.medida + PERDA_SERRA <= TAMANHO_BARRA) {
          barra.pecas.push(peca);
          encaixou = true;
          break;
        }
      }

      if (!encaixou) {
        barras.push({
          pecas: [peca],
        });
      }
    });

    return barras.map((barra, index) => {
      const usado = barra.pecas.reduce(
        (s, p) => s + p.medida + PERDA_SERRA,
        0
      );

      return {
        numero: index + 1,
        pecas: barra.pecas,
        usado,
        sobra: TAMANHO_BARRA - usado,
        aproveitamento: (usado / TAMANHO_BARRA) * 100,
      };
    });
  }

  const barras = otimizarCorte();

  const totalUsado = barras.reduce((s, b) => s + b.usado, 0);
  const totalSobra = barras.reduce((s, b) => s + b.sobra, 0);
  const aproveitamentoGeral =
    barras.length > 0 ? (totalUsado / (barras.length * TAMANHO_BARRA)) * 100 : 0;

  return (
    <div style={page}>
      <h1>Plano de Corte Inteligente PRO</h1>
      <p style={{ color: "#64748b" }}>
        Otimização industrial de barras de 6000 mm com perda de serra.
      </p>

      <form style={card} onSubmit={adicionarPeca}>
        <h2>Adicionar Peças</h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Perfil / Código"
            value={form.perfil}
            onChange={(e) => setForm({ ...form, perfil: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Medida mm"
            value={form.medida}
            onChange={(e) => setForm({ ...form, medida: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
          />

          <button style={btn} type="submit">
            Adicionar
          </button>
        </div>

        <button type="button" style={btnDanger} onClick={limpar}>
          Limpar Plano
        </button>
      </form>

      <div style={resumoGrid}>
        <Card titulo="Barras" valor={barras.length} />
        <Card titulo="Peças" valor={pecas.length} />
        <Card titulo="Usado" valor={`${totalUsado} mm`} />
        <Card titulo="Sobra" valor={`${totalSobra} mm`} />
        <Card titulo="Aproveitamento" valor={`${aproveitamentoGeral.toFixed(2)}%`} destaque />
      </div>

      <div style={card}>
        <h2>Resultado da Otimização</h2>

        {barras.length === 0 && <p>Nenhuma peça adicionada.</p>}

        {barras.map((barra) => (
          <div key={barra.numero} style={barraBox}>
            <h3>Barra {barra.numero} - 6000 mm</h3>

            <div style={barraVisual}>
              {barra.pecas.map((p, i) => (
                <div
                  key={i}
                  style={{
                    ...pecaVisual,
                    width: `${Math.max((p.medida / TAMANHO_BARRA) * 100, 8)}%`,
                  }}
                >
                  {p.medida}
                </div>
              ))}
            </div>

            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Perfil</th>
                  <th style={th}>Medida</th>
                </tr>
              </thead>

              <tbody>
                {barra.pecas.map((p, i) => (
                  <tr key={i}>
                    <td style={td}>{p.perfil}</td>
                    <td style={td}>{p.medida} mm</td>
                  </tr>
                ))}

                <tr>
                  <td style={td}><b>Usado</b></td>
                  <td style={td}><b>{barra.usado} mm</b></td>
                </tr>

                <tr>
                  <td style={td}><b>Sobra</b></td>
                  <td style={td}><b>{barra.sobra} mm</b></td>
                </tr>

                <tr>
                  <td style={td}><b>Aproveitamento</b></td>
                  <td style={td}><b>{barra.aproveitamento.toFixed(2)}%</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor, destaque }) {
  return (
    <div style={destaque ? cardDark : cardResumo}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
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
  marginTop: 20,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  gap: 12,
};

const input = {
  padding: 13,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btn = {
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnDanger = {
  ...btn,
  background: "#dc2626",
  padding: "13px 18px",
  marginTop: 15,
};

const resumoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 15,
  marginTop: 20,
};

const cardResumo = {
  background: "white",
  borderRadius: 18,
  padding: 20,
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const cardDark = {
  ...cardResumo,
  background: "#0f172a",
  color: "white",
};

const barraBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  marginTop: 20,
};

const barraVisual = {
  height: 36,
  background: "#e5e7eb",
  borderRadius: 10,
  display: "flex",
  overflow: "hidden",
  marginBottom: 15,
};

const pecaVisual = {
  background: "#2563eb",
  color: "white",
  fontSize: 11,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRight: "1px solid white",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 10,
  background: "#f1f5f9",
};

const td = {
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
};