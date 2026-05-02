import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

const STATUS = [
  "EM PROJETO",
  "CORTE",
  "USINAGEM",
  "MONTAGEM",
  "VIDRO",
  "EXPEDIÇÃO",
  "INSTALAÇÃO",
  "FINALIZADO",
];

export default function OrdemProducao() {
  const [ordens, setOrdens] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [form, setForm] = useState({
    orcamento_id: "",
    cliente: "",
    observacao: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [resOrdens, resOrcamentos] = await Promise.all([
        fetch(`${API}/ordens-producao`),
        fetch(`${API}/orcamentos`),
      ]);

      const dadosOrdens = await resOrdens.json();
      const dadosOrcamentos = await resOrcamentos.json();

      setOrdens(Array.isArray(dadosOrdens) ? dadosOrdens : []);
      setOrcamentos(Array.isArray(dadosOrcamentos) ? dadosOrcamentos : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function criarOrdem(e) {
    e.preventDefault();

    await fetch(`${API}/ordens-producao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orcamento_id: form.orcamento_id || null,
        cliente: form.cliente,
        observacao: form.observacao,
        status: "EM PROJETO",
      }),
    });

    setForm({
      orcamento_id: "",
      cliente: "",
      observacao: "",
    });

    carregar();
  }

  async function alterarStatus(id, status) {
    await fetch(`${API}/ordens-producao/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    carregar();
  }

  return (
    <div style={page}>
      <h1>Ordem de Produção Industrial</h1>
      <p style={{ color: "#64748b" }}>
        Controle de corte, usinagem, montagem, vidro, expedição e instalação.
      </p>

      <form style={card} onSubmit={criarOrdem}>
        <h2>Nova Ordem de Produção</h2>

        <div style={grid}>
          <select
            style={input}
            value={form.orcamento_id}
            onChange={(e) =>
              setForm({ ...form, orcamento_id: e.target.value })
            }
          >
            <option value="">Vincular orçamento</option>
            {orcamentos.map((o) => (
              <option key={o.id} value={o.id}>
                Orçamento #{o.id} - R$ {Number(o.valor_total || o.venda_total || 0).toFixed(2)}
              </option>
            ))}
          </select>

          <input
            style={input}
            placeholder="Cliente / Obra"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />

          <input
            style={input}
            placeholder="Observação"
            value={form.observacao}
            onChange={(e) =>
              setForm({ ...form, observacao: e.target.value })
            }
          />

          <button style={btn} type="submit">
            Criar OP
          </button>
        </div>
      </form>

      <div style={kanban}>
        {STATUS.map((status) => (
          <div key={status} style={coluna}>
            <h3>{status}</h3>

            {ordens
              .filter((op) => op.status === status)
              .map((op) => (
                <div key={op.id} style={opCard}>
                  <strong>OP #{op.id}</strong>
                  <p>Cliente: {op.cliente || "Não informado"}</p>
                  <p>Orçamento: {op.orcamento_id || "-"}</p>
                  <p>{op.observacao}</p>

                  <select
                    style={input}
                    value={op.status}
                    onChange={(e) => alterarStatus(op.id, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
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
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 2fr 2fr 1fr",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
};

const btn = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const kanban = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18,
  marginTop: 25,
};

const coluna = {
  background: "white",
  borderRadius: 18,
  padding: 16,
  minHeight: 240,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const opCard = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  marginTop: 12,
};