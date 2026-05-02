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

export default function MobileProducao() {
  const [ordens, setOrdens] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(`${API}/ordens-producao`);
      const data = await res.json();
      setOrdens(Array.isArray(data) ? data : []);
    } catch {
      setOrdens([]);
    }
  }

  async function alterarStatus(id, status) {
    await fetch(`${API}/ordens-producao/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    carregar();
  }

  return (
    <div style={page}>
      <h1>Produção Mobile</h1>
      <p style={{ color: "#64748b" }}>
        Acompanhe e atualize a produção pelo celular.
      </p>

      {ordens.map((op) => (
        <div key={op.id} style={card}>
          <strong>OP #{op.id}</strong>

          <p>Cliente: {op.cliente || "Não informado"}</p>
          <p>Orçamento: {op.orcamento_id || "-"}</p>
          <p>{op.observacao}</p>

          <select
            style={input}
            value={op.status || "EM PROJETO"}
            onChange={(e) => alterarStatus(op.id, e.target.value)}
          >
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div style={checklist}>
            <label>
              <input type="checkbox" /> Conferido
            </label>

            <label>
              <input type="checkbox" /> Cortado
            </label>

            <label>
              <input type="checkbox" /> Montado
            </label>

            <label>
              <input type="checkbox" /> Pronto para entrega
            </label>
          </div>
        </div>
      ))}

      {ordens.length === 0 && (
        <div style={card}>
          Nenhuma ordem de produção encontrada.
        </div>
      )}
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: 18,
  fontFamily: "Arial, sans-serif",
};

const card = {
  background: "white",
  borderRadius: 18,
  padding: 18,
  marginTop: 15,
  boxShadow: "0 8px 25px rgba(15,23,42,0.08)",
};

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  marginTop: 10,
};

const checklist = {
  display: "grid",
  gap: 10,
  marginTop: 15,
};