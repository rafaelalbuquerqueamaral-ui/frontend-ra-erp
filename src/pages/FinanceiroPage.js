import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function FinanceiroPage() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [resumo, setResumo] = useState({
    total_registros: 0,
    custo_total: 0,
    venda_total: 0,
    lucro_total: 0
  });

  const [orcamentoId, setOrcamentoId] = useState("");
  const [custoTotal, setCustoTotal] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [o, f, r] = await Promise.all([
        fetch(`${API}/orcamentos`).then((res) => res.json()),
        fetch(`${API}/financeiro`).then((res) => res.json()),
        fetch(`${API}/financeiro/resumo`).then((res) => res.json())
      ]);

      setOrcamentos(Array.isArray(o) ? o : []);
      setFinanceiro(Array.isArray(f) ? f : []);
      setResumo(r || {});
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar financeiro");
    }
  }

  async function gerarFinanceiro(e) {
    e.preventDefault();

    const res = await fetch(`${API}/financeiro/gerar/${orcamentoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        custo_total: custoTotal
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar financeiro");
      return;
    }

    setOrcamentoId("");
    setCustoTotal("");
    carregar();
  }

  async function alterarStatus(id, status) {
    const res = await fetch(`${API}/financeiro/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao atualizar status");
      return;
    }

    carregar();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Financeiro</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <Card titulo="Registros" valor={resumo.total_registros || 0} />
        <Card titulo="Custo Total" valor={`R$ ${Number(resumo.custo_total || 0).toFixed(2)}`} />
        <Card titulo="Venda Total" valor={`R$ ${Number(resumo.venda_total || 0).toFixed(2)}`} />
        <Card titulo="Lucro Total" valor={`R$ ${Number(resumo.lucro_total || 0).toFixed(2)}`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Gerar Financeiro do Orçamento</h2>

          <form onSubmit={gerarFinanceiro}>
            <select
              style={input}
              value={orcamentoId}
              onChange={(e) => setOrcamentoId(e.target.value)}
            >
              <option value="">Selecione o orçamento</option>
              {orcamentos.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} - {o.cliente_nome} - {o.tipologia_nome} - R$ {Number(o.total || 0).toFixed(2)}
                </option>
              ))}
            </select>

            <input
              style={input}
              type="number"
              step="0.01"
              placeholder="Custo total"
              value={custoTotal}
              onChange={(e) => setCustoTotal(e.target.value)}
            />

            <button style={button} type="submit">
              Gerar Financeiro
            </button>
          </form>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Lista Financeira</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Tipologia</Th>
                <Th>Custo</Th>
                <Th>Venda</Th>
                <Th>Lucro</Th>
                <Th>Margem</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {financeiro.map((f) => (
                <tr key={f.id}>
                  <Td>{f.id}</Td>
                  <Td>{f.cliente_nome}</Td>
                  <Td>{f.tipologia_nome}</Td>
                  <Td>R$ {Number(f.custo_total || 0).toFixed(2)}</Td>
                  <Td>R$ {Number(f.venda_total || 0).toFixed(2)}</Td>
                  <Td>R$ {Number(f.lucro_bruto || 0).toFixed(2)}</Td>
                  <Td>{Number(f.margem_percent || 0).toFixed(2)}%</Td>
                  <Td>
                    <select
                      value={f.status || "PENDENTE"}
                      onChange={(e) => alterarStatus(f.id, e.target.value)}
                    >
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="APROVADO">APROVADO</option>
                      <option value="RECEBIDO">RECEBIDO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
      <div style={{ color: "#475569", marginBottom: 10 }}>{titulo}</div>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>{valor}</div>
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

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

function Th({ children }) {
  return <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{children}</td>;
}