import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TipologiaInteligente from "./pages/TipologiaInteligente";
import OrcamentoPro from "./pages/OrcamentoPro";
import BibliotecaIndustrial from "./pages/BibliotecaIndustrial";
import PlanoDeCorte from "./pages/PlanoDeCorte";
import PDFTecnicoPRO from "./pages/PDFTecnicoPRO";
import FachadaCADPro from "./pages/FachadaCADPro";
import ProducaoIndustrial from "./pages/ProducaoIndustrial";
import FinanceiroIndustrial from "./pages/FinanceiroIndustrial";
import Tipologias from "./pages/Tipologias";
import FormulasTipologia from "./pages/FormulasTipologia";
export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <aside style={styles.menu}>
          <h2 style={styles.logo}>R&A VIDROS</h2>
          <Link
  style={styles.link}
  to="/tipologia-inteligente"
>
  Tipologia Inteligente
</Link>
          <Link style={styles.link} to="/orcamento-pro">Orçamento PRO</Link>
          <Link style={styles.link} to="/biblioteca-industrial">Biblioteca Industrial</Link>
          <Link style={styles.link} to="/fachada-cad">Fachada CAD</Link>
          <Link style={styles.link} to="/plano-corte">Plano de Corte</Link>
          <Link style={styles.link} to="/pdf-tecnico">PDF Técnico</Link>
          <Link style={styles.link} to="/producao">Produção</Link>
          <Link style={styles.link} to="/financeiro">Financeiro</Link>
          <Link style={styles.link} to="/clientes">Clientes</Link>
<Link style={styles.link} to="/obras">Obras</Link>
<Link style={styles.link} to="/perfis">Perfis</Link>
<Link style={styles.link} to="/vidros">Vidros</Link>
<Link style={styles.link} to="/acessorios">Acessórios</Link>
<Link style={styles.link} to="/tipologias">Tipologias</Link>
<Link
  style={styles.link}
  to="/formulas-tipologia"
>
  Fórmulas
</Link>
        </aside>

        <main style={styles.conteudo}>
          <Routes>
            <Route path="/" element={<OrcamentoPro />} />
            <Route path="/orcamento-pro" element={<OrcamentoPro />} />
            <Route path="/biblioteca-industrial" element={<BibliotecaIndustrial />} />
            <Route path="/plano-corte" element={<PlanoDeCorte />} />
            <Route path="/pdf-tecnico" element={<PDFTecnicoPRO />} />
            <Route path="/fachada-cad" element={<FachadaCADPro />} />
            <Route path="/fachada-cad-pro" element={<FachadaCADPro />} />
            <Route path="/producao" element={<ProducaoIndustrial />} />
            <Route path="/financeiro" element={<FinanceiroIndustrial />} />
            <Route path="/clientes" element={<PaginaSimples titulo="Clientes" />} />
<Route path="/obras" element={<PaginaSimples titulo="Obras" />} />
<Route path="/perfis" element={<PaginaSimples titulo="Cadastro de Perfis" />} />
<Route path="/vidros" element={<PaginaSimples titulo="Cadastro de Vidros" />} />
<Route
  path="/formulas-tipologia"
  element={<FormulasTipologia />}
/>
<Route
  path="/tipologia-inteligente"
  element={<TipologiaInteligente />}
/>
<Route path="/acessorios" element={<PaginaSimples titulo="Cadastro de Acessórios" />} />
<Route
  path="/tipologias"
  element={<Tipologias />}
/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
function PaginaSimples({ titulo }) {
  return (
    <div style={{ padding: 30 }}>
      <h1>{titulo}</h1>
      <p>Módulo em construção.</p>
    </div>
  );
}
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
  },
  menu: {
    width: "230px",
    background: "#0f172a",
    color: "#fff",
    padding: "22px 16px",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
  },
  logo: {
    fontSize: "20px",
    marginBottom: "25px",
  },
  link: {
    display: "block",
    color: "#e5e7eb",
    textDecoration: "none",
    padding: "11px 10px",
    borderRadius: "8px",
    marginBottom: "6px",
    fontWeight: "700",
  },
  conteudo: {
    marginLeft: "230px",
    width: "calc(100% - 230px)",
  },
};