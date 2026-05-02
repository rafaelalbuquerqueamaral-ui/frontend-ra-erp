import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function BancoTecnico() {
  const [perfis, setPerfis] = useState([]);

  const [form, setForm] = useState({
    fabricante: "",
    linha: "Gold",
    codigo: "",
    descricao: "",
    peso_kg_m: "",
    valor_kg: "",
    acabamento: "",
    observacao: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(`${API}/perfis`);
      const data = await res.json();
      setPerfis(Array.isArray(data) ? data : []);
    } catch {
      setPerfis([]);
    }
  }

  async function salvar(e) {
    e.preventDefault();

    const res = await fetch(`${API}/perfis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Erro ao salvar perfil.");
      return;
    }

    alert("Perfil técnico salvo!");

    setForm({
      fabricante: "",
      linha: "Gold",
      codigo: "",
      descricao: "",
      peso_kg_m: "",
      valor_kg: "",
      acabamento: "",
      observacao: "",
    });

    carregar();
  }

  return (
    <div style={page}>
      <h1>Banco Técnico de Perfis</h1>
      <p style={{ color: "#64748b" }}>
        Biblioteca industrial de perfis por fabricante, linha, peso e acabamento.
      </p>

      <form style={card} onSubmit={salvar}>
        <h2>Novo Perfil Técnico</h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Fabricante"
            value={form.fabricante}
            onChange={(e) => setForm({ ...form, fabricante: e.target.value })}
          />

          <select
            style={input}
            value={form.linha}
            onChange={(e) => setForm({ ...form, linha: e.target.value })}
          >
            <option>Gold</option>
            <option>Suprema</option>
            <option>Integrada</option>
            <option>Especial</option>
          </select>

          <input
            style={input}
            placeholder="Código do perfil"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />

          <input
            style={input}
            placeholder="Descrição técnica"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Peso kg/m"
            value={form.peso_kg_m}
            onChange={(e) => setForm({ ...form, peso_kg_m: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Valor kg"
            value={form.valor_kg}
            onChange={(e) => setForm({ ...form, valor_kg: e.target.value })}
          />

          <input
            style={input}
            placeholder="Acabamento / Cor"
            value={form.acabamento}
            onChange={(e) => setForm({ ...form, acabamento: e.target.value })}
          />

          <input
            style={input}
            placeholder="Observação"
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          />
        </div>

        <button style={btn}>Salvar Perfil Técnico</button>
      </form>

      <div style={card}>
        <h2>Perfis Cadastrados</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Fabricante</th>
              <th style={th}>Linha</th>
              <th style={th}>Código</th>
              <th style={th}>Descrição</th>
              <th style={th}>Peso</th>
              <th style={th}>Valor kg</th>
              <th style={th}>Acabamento</th>
            </tr>
          </thead>

          <tbody>
            {perfis.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.fabricante}</td>
                <td style={td}>{p.linha}</td>
                <td style={td}>{p.codigo}</td>
                <td style={td}>{p.descricao || p.nome}</td>
                <td style={td}>{p.peso_kg_m || p.peso_kg} kg/m</td>
                <td style={td}>
                  {Number(p.valor_kg || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td style={td}>{p.acabamento || p.cor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {perfis.length === 0 && <p>Nenhum perfil cadastrado.</p>}
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
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
};

const input = {
  padding: 13,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btn = {
  marginTop: 18,
  padding: "14px 24px",
  border: "none",
  borderRadius: 12,
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