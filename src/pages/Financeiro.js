import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Financeiro() {
  const [lancamentos, setLancamentos] = useState([]);

  const [form, setForm] = useState({
    tipo: "RECEBER",
    descricao: "",
    valor: "",
    vencimento: "",
    categoria: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(`${API}/financeiro`);
      const data = await res.json();
      setLancamentos(Array.isArray(data) ? data : []);
    } catch {
      setLancamentos([]);
    }
  }

  async function salvar(e) {
    e.preventDefault();

    await fetch(`${API}/financeiro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      tipo: "RECEBER",
      descricao: "",
      valor: "",
      vencimento: "",
      categoria: "",
    });

    carregar();
  }

  async function mudarStatus(id, status) {
    await fetch(`${API}/financeiro/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    carregar();
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const receber = lancamentos
    .filter((l) => l.tipo === "RECEBER")
    .reduce((s, l) => s + Number(l.valor || 0), 0);

  const pagar = lancamentos
    .filter((l) => l.tipo === "PAGAR")
    .reduce((s, l) => s + Number(l.valor || 0), 0);

  const recebido = lancamentos
    .filter((l) => l.tipo === "RECEBER" && l.status === "PAGO")
    .reduce((s, l) => s + Number(l.valor || 0), 0);

  const pago = lancamentos
    .filter((l) => l.tipo === "PAGAR" && l.status === "PAGO")
    .reduce((s, l) => s + Number(l.valor || 0), 0);

  const saldoPrevisto = receber - pagar;
  const saldoReal = recebido - pago;

  return (
    <div style={page}>
      <h1>Financeiro ERP Industrial</h1>
      <p style={{ color: "#64748b" }}>
        Controle de contas a pagar, receber, fluxo de caixa e lucro.
      </p>

      <div style={cards}>
        <Card titulo="A Receber" valor={dinheiro(receber)} />
        <Card titulo="A Pagar" valor={dinheiro(pagar)} />
        <Card titulo="Saldo Previsto" valor={dinheiro(saldoPrevisto)} destaque />
        <Card titulo="Saldo Real" valor={dinheiro(saldoReal)} destaque />
      </div>

      <form style={card} onSubmit={salvar}>
        <h2>Novo Lançamento</h2>

        <div style={grid}>
          <select
            style={input}
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="RECEBER">Receber</option>
            <option value="PAGAR">Pagar</option>
          </select>

          <input
            style={input}
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <input
            style={input}
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
          />

          <input
            style={input}
            type="date"
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
          />

          <button style={btn}>Salvar</button>
        </div>
      </form>

      <div style={card}>
        <h2>Lançamentos Financeiros</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Tipo</th>
              <th style={th}>Descrição</th>
              <th style={th}>Categoria</th>
              <th style={th}>Valor</th>
              <th style={th}>Vencimento</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {lancamentos.map((l) => (
              <tr key={l.id}>
                <td style={td}>{l.tipo}</td>
                <td style={td}>{l.descricao}</td>
                <td style={td}>{l.categoria}</td>
                <td style={td}>{dinheiro(l.valor)}</td>
                <td style={td}>
                  {l.vencimento
                    ? new Date(l.vencimento).toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td style={td}>
                  <select
                    style={input}
                    value={l.status || "PENDENTE"}
                    onChange={(e) => mudarStatus(l.id, e.target.value)}
                  >
                    <option>PENDENTE</option>
                    <option>PAGO</option>
                    <option>CANCELADO</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lancamentos.length === 0 && <p>Nenhum lançamento financeiro.</p>}
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

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginTop: 20,
};

const cardResumo = {
  background: "white",
  borderRadius: 18,
  padding: 22,
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const cardDark = {
  ...cardResumo,
  background: "#0f172a",
  color: "white",
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  marginTop: 24,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
};

const btn = {
  border: "none",
  borderRadius: 10,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 12,
  background: "#f1f5f9",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};