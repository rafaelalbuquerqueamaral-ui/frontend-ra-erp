import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3001";

export default function Dashboard() {
  const [dados, setDados] = useState({
    clientes: 0,
    orcamentos: 0,
    fachadas: 0,
    ordens: 0,
    financeiro: [],
    vendaTotal: 0,
    receber: 0,
    pagar: 0,
    saldo: 0,
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [clientes, orcamentos, fachadas, ordens, financeiro] =
        await Promise.all([
          fetch(`${API}/clientes`).then((r) => r.json()),
          fetch(`${API}/orcamentos`).then((r) => r.json()),
          fetch(`${API}/fachadas`).then((r) => r.json()),
          fetch(`${API}/ordens-producao`).then((r) => r.json()),
          fetch(`${API}/financeiro`).then((r) => r.json()),
        ]);

      const listaOrc = Array.isArray(orcamentos) ? orcamentos : [];
      const listaFin = Array.isArray(financeiro) ? financeiro : [];

      const vendaTotal = listaOrc.reduce(
        (s, o) => s + Number(o.valor_total || o.venda_total || 0),
        0
      );

      const receber = listaFin
        .filter((f) => f.tipo === "RECEBER")
        .reduce((s, f) => s + Number(f.valor || 0), 0);

      const pagar = listaFin
        .filter((f) => f.tipo === "PAGAR")
        .reduce((s, f) => s + Number(f.valor || 0), 0);

      setDados({
        clientes: Array.isArray(clientes) ? clientes.length : 0,
        orcamentos: listaOrc.length,
        fachadas: Array.isArray(fachadas) ? fachadas.length : 0,
        ordens: Array.isArray(ordens) ? ordens.length : 0,
        financeiro: listaFin,
        vendaTotal,
        receber,
        pagar,
        saldo: receber - pagar,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const barrasFinanceiro = [
    { nome: "Vendas", valor: dados.vendaTotal },
    { nome: "Receber", valor: dados.receber },
    { nome: "Pagar", valor: dados.pagar },
    { nome: "Saldo", valor: dados.saldo },
  ];

  const maior = Math.max(...barrasFinanceiro.map((b) => Math.abs(b.valor)), 1);

  return (
    <div style={page}>
      <div style={topo}>
        <div>
          <h1>Dashboard Industrial R&A VIDROS</h1>
          <p style={{ color: "#64748b" }}>
            Indicadores de vendas, produção, fachadas, financeiro e operação.
          </p>
        </div>

        <button style={btn} onClick={carregar}>
          Atualizar
        </button>
      </div>

      <div style={cards}>
        <Card titulo="Clientes" valor={dados.clientes} />
        <Card titulo="Orçamentos" valor={dados.orcamentos} />
        <Card titulo="Fachadas" valor={dados.fachadas} />
        <Card titulo="Ordens Produção" valor={dados.ordens} />
        <Card titulo="Faturamento" valor={dinheiro(dados.vendaTotal)} destaque />
        <Card titulo="A Receber" valor={dinheiro(dados.receber)} />
        <Card titulo="A Pagar" valor={dinheiro(dados.pagar)} />
        <Card titulo="Saldo Previsto" valor={dinheiro(dados.saldo)} destaque />
      </div>

      <div style={linha}>
        <div style={cardGrande}>
          <h2>Resumo Financeiro</h2>

          {barrasFinanceiro.map((b) => (
            <div key={b.nome} style={graficoLinha}>
              <span style={{ width: 90 }}>{b.nome}</span>

              <div style={barraFundo}>
                <div
                  style={{
                    ...barra,
                    width: `${(Math.abs(b.valor) / maior) * 100}%`,
                  }}
                />
              </div>

              <strong style={{ width: 130, textAlign: "right" }}>
                {dinheiro(b.valor)}
              </strong>
            </div>
          ))}
        </div>

        <div style={cardGrande}>
          <h2>Atalhos Rápidos</h2>

          <div style={atalhos}>
            <Atalho to="/clientes" texto="Clientes" />
            <Atalho to="/tipologias" texto="Tipologias" />
            <Atalho to="/orcamento-pro" texto="Orçamento PRO" />
            <Atalho to="/fachada-pro" texto="Fachada CAD" />
            <Atalho to="/ordem-producao" texto="Produção" />
            <Atalho to="/financeiro" texto="Financeiro" />
            <Atalho to="/plano-corte" texto="Plano de Corte" />
            <Atalho to="/banco-tecnico" texto="Banco Técnico" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ titulo, valor, destaque }) {
  return (
    <div style={destaque ? cardDark : card}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function Atalho({ to, texto }) {
  return (
    <Link style={atalho} to={to}>
      {texto}
    </Link>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: 30,
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginTop: 24,
};

const card = {
  background: "white",
  borderRadius: 18,
  padding: 22,
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const cardDark = {
  ...card,
  background: "#0f172a",
  color: "white",
};

const linha = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 20,
  marginTop: 24,
};

const cardGrande = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const graficoLinha = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginTop: 16,
};

const barraFundo = {
  flex: 1,
  height: 18,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
};

const barra = {
  height: "100%",
  background: "#2563eb",
};

const atalhos = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const atalho = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: "bold",
};

const btn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};