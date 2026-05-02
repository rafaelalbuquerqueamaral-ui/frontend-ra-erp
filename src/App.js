import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Perfis from "./pages/Perfis";
import Vidros from "./pages/Vidros";
import Tipologias from "./pages/Tipologias";
import OrcamentoPro from "./pages/OrcamentoPro";
import FachadaCADPro from "./pages/FachadaCADPro";
import Fachadas from "./pages/Fachadas";
import OrdemProducao from "./pages/OrdemProducao";
import PlanoCorte from "./pages/PlanoCorte";
import BancoTecnico from "./pages/BancoTecnico";
import Financeiro from "./pages/Financeiro";
import ImportadorPerfis from "./pages/ImportadorPerfis";
import MobileProducao from "./pages/MobileProducao";
export default function App() {
  return (
    <BrowserRouter>
      <div style={layout}>
        <aside style={sidebar}>
          <h2 style={logo}>R&A VIDROS</h2>

          <Link style={link} to="/">Dashboard</Link>
          <Link style={link} to="/clientes">Clientes</Link>
          <Link style={link} to="/perfis">Perfis</Link>
          <Link style={link} to="/vidros">Vidros</Link>
          <Link style={link} to="/tipologias">Tipologias</Link>
          <Link style={link} to="/orcamento-pro">Orçamento PRO</Link>
          <Link style={link} to="/fachada-pro">Fachada CAD PRO</Link>
          <Link style={link} to="/fachadas">Fachadas Salvas</Link>
          <Link style={link} to="/ordem-producao">Produção</Link>
         <Link style={link} to="/plano-corte">Plano de Corte</Link>
         <Link style={link} to="/banco-tecnico">Banco Técnico</Link>
         <Link style={link} to="/financeiro">Financeiro</Link>
         <Link style={link} to="/importador-perfis">Importador Perfis</Link>
         <Link style={link} to="/mobile-producao">Mobile Produção</Link>
        </aside>

        <main style={main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/perfis" element={<Perfis />} />
            <Route path="/vidros" element={<Vidros />} />
            <Route path="/tipologias" element={<Tipologias />} />
            <Route path="/orcamento-pro" element={<OrcamentoPro />} />
            <Route path="/fachada-pro" element={<FachadaCADPro />} />
            <Route path="/fachadas" element={<Fachadas />} />
            <Route path="/ordem-producao" element={<OrdemProducao />} />
            <Route path="/plano-corte" element={<PlanoCorte />} />
            <Route path="/banco-tecnico" element={<BancoTecnico />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/mobile-producao" element={<MobileProducao />} />
            <Route path="/importador-perfis" element={<ImportadorPerfis />} />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#eef2f7",
};

const sidebar = {
  width: 250,
  background: "#0f172a",
  color: "white",
  padding: 20,
};

const logo = {
  marginBottom: 30,
};

const link = {
  display: "block",
  color: "white",
  textDecoration: "none",
  padding: "13px 12px",
  borderRadius: 10,
  marginBottom: 8,
  background: "rgba(255,255,255,0.08)",
};

const main = {
  flex: 1,
  overflow: "auto",
};