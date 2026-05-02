import React, { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
  });

  async function carregarClientes() {
    const resp = await fetch("http://localhost:3001/clientes");
    const dados = await resp.json();

    setClientes(Array.isArray(dados) ? dados : []);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function salvarCliente() {
    await fetch("http://localhost:3001/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      nome: "",
      telefone: "",
      email: "",
      cidade: "",
    });

    carregarClientes();
  }

  async function excluir(id) {
    await fetch(`http://localhost:3001/clientes/${id}`, {
      method: "DELETE",
    });

    carregarClientes();
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1>CLIENTES</h1>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) =>
            setForm({ ...form, nome: e.target.value })
          }
        />

        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) =>
            setForm({
              ...form,
              telefone: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) =>
            setForm({
              ...form,
              cidade: e.target.value,
            })
          }
        />

        <button onClick={salvarCliente}>
          Salvar Cliente
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        {clientes.map((c) => (
          <div
            key={c.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: 10,
            }}
          >
            <h3>{c.nome}</h3>

            <p>{c.telefone}</p>

            <p>{c.email}</p>

            <p>{c.cidade}</p>

            <button
              onClick={() => excluir(c.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}