import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: ""
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const res = await fetch(`${API}/clientes`);
    const data = await res.json();
    setClientes(Array.isArray(data) ? data : []);
  }

  async function salvar(e) {
    e.preventDefault();

    const res = await fetch(`${API}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar cliente");
      return;
    }

    setForm({
      nome: "",
      telefone: "",
      email: "",
      cidade: ""
    });

    carregar();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Clientes</h1>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20 }}>
        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Novo Cliente</h2>

          <form onSubmit={salvar}>
            <input
              style={input}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              style={input}
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
            <input
              style={input}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={input}
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />

            <button style={button} type="submit">
              Salvar Cliente
            </button>
          </form>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Lista de Clientes</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nome</Th>
                <Th>Telefone</Th>
                <Th>Email</Th>
                <Th>Cidade</Th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <Td>{c.id}</Td>
                  <Td>{c.nome}</Td>
                  <Td>{c.telefone}</Td>
                  <Td>{c.email}</Td>
                  <Td>{c.cidade}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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