// src/pages/Clientes.js

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.log(err);
      alert("Erro ao carregar clientes");
    }
  };

  const salvarCliente = async () => {
    try {
      await api.post("/clientes", {
        nome,
        telefone,
        email,
        cidade,
      });

      setNome("");
      setTelefone("");
      setEmail("");
      setCidade("");

      carregarClientes();
    } catch (err) {
      console.log(err);
      alert("Erro ao salvar");
    }
  };

  const excluirCliente = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Clientes</h1>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />

        <button onClick={salvarCliente}>
          Salvar Cliente
        </button>
      </div>

      {clientes.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#fff",
            marginBottom: 10,
            padding: 15,
            borderRadius: 10,
          }}
        >
          <h3>{c.nome}</h3>

          <p>{c.telefone}</p>
          <p>{c.email}</p>
          <p>{c.cidade}</p>

          <button
            onClick={() => excluirCliente(c.id)}
          >
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}