import React, { useState } from "react";

const API = "http://localhost:3001";

const PERFIS_PADRAO = [
  {
    fabricante: "Alcoa / Hydro",
    linha: "Gold",
    codigo: "G-001",
    descricao: "Marco lateral Gold",
    peso_kg_m: 0.72,
    valor_kg: 45,
    acabamento: "Branco",
  },
  {
    fabricante: "Alcoa / Hydro",
    linha: "Gold",
    codigo: "G-002",
    descricao: "Folha janela Gold",
    peso_kg_m: 0.58,
    valor_kg: 45,
    acabamento: "Branco",
  },
  {
    fabricante: "Alcoa / Hydro",
    linha: "Suprema",
    codigo: "S-001",
    descricao: "Marco lateral Suprema",
    peso_kg_m: 0.82,
    valor_kg: 48,
    acabamento: "Branco",
  },
  {
    fabricante: "Alcoa / Hydro",
    linha: "Suprema",
    codigo: "S-002",
    descricao: "Travessa Suprema",
    peso_kg_m: 0.65,
    valor_kg: 48,
    acabamento: "Branco",
  },
];

export default function ImportadorPerfis() {
  const [lista] = useState(PERFIS_PADRAO);

  async function importarTodos() {
    for (const perfil of lista) {
      await fetch(`${API}/perfis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: perfil.descricao,
          codigo: perfil.codigo,
          peso_kg_m: perfil.peso_kg_m,
          valor_kg: perfil.valor_kg,
          cor: perfil.acabamento,
          fabricante: perfil.fabricante,
          linha: perfil.linha,
          acabamento: perfil.acabamento,
          descricao: perfil.descricao,
        }),
      });
    }

    alert("Perfis importados para o banco técnico!");
  }

  return (
    <div style={page}>
      <h1>Importador Industrial de Perfis</h1>

      <div style={card}>
        <button style={btn} onClick={importarTodos}>
          Importar Todos os Perfis
        </button>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Fabricante</th>
              <th style={th}>Linha</th>
              <th style={th}>Código</th>
              <th style={th}>Descrição</th>
              <th style={th}>Peso kg/m</th>
              <th style={th}>Valor kg</th>
              <th style={th}>Acabamento</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((p, i) => (
              <tr key={i}>
                <td style={td}>{p.fabricante}</td>
                <td style={td}>{p.linha}</td>
                <td style={td}>{p.codigo}</td>
                <td style={td}>{p.descricao}</td>
                <td style={td}>{p.peso_kg_m}</td>
                <td style={td}>R$ {p.valor_kg}</td>
                <td style={td}>{p.acabamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  marginTop: 20,
};

const btn = {
  padding: "14px 22px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: 20,
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