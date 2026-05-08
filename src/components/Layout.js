import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={container}>
      <aside style={sidebar}>
        <div style={logo}>R&A</div>

        <h2 style={titulo}>Sistema</h2>

        <Link style={link} to="/">
          Painel
        </Link>

        <Link style={link} to="/clientes">
          Clientes
        </Link>

        <Link style={link} to="/perfis">
          Perfis
        </Link>

        <Link style={link} to="/vidros">
          Vidros / Chapas
        </Link>

        <Link style={link} to="/tipologias">
          Tipologias
        </Link>

        <Link style={linkDestaque} to="/tipologia-inteligente">
          ⭐ Tipologia Inteligente
        </Link>

        <Link style={link} to="/tipologia-tecnica">
          Tipologia Técnica
        </Link>

        <Link style={link} to="/orcamentos">
          Orçamentos
        </Link>

        <Link style={link} to="/orcamento-pro">
          Orçamento PRO
        </Link>

        <Link style={link} to="/fachadas">
          Fachadas
        </Link>

        <Link style={link} to="/fachada-cad">
          Fachada CAD
        </Link>

        <Link style={link} to="/importador-perfis">
          Importador Perfis
        </Link>

        <Link style={link} to="/acessorios">
          Acessórios
        </Link>

        <Link style={link} to="/cores">
          Tratamento / Cores
        </Link>
        <Link
  style={link}
  to="/biblioteca-industrial"
>
  Biblioteca Industrial
</Link>

        <div style={usuario}>
          Usuário: ADMINISTRADOR
        </div>
      </aside>

      <main style={main}>
        {children}
      </main>
    </div>
  );
}

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
};

const sidebar = {
  width: 280,
  background:
    "linear-gradient(180deg,#020617,#0f172a,#1e3a5f)",
  color: "#fff",
  padding: 24,
  boxSizing: "border-box",
};

const logo = {
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: 5,
};

const titulo = {
  marginBottom: 25,
};

const link = {
  display: "block",
  color: "#fff",
  textDecoration: "none",
  padding: "10px 0",
  fontWeight: "bold",
};

const linkDestaque = {
  display: "block",
  color: "#fde68a",
  textDecoration: "none",
  padding: "12px 0",
  fontWeight: "bold",
  fontSize: 17,
};

const usuario = {
  marginTop: 30,
  borderTop: "1px solid rgba(255,255,255,0.2)",
  paddingTop: 20,
  fontWeight: "bold",
  fontSize: 13,
};

const main = {
  flex: 1,
  padding: 20,
};