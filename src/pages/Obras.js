import { useEffect, useState } from "react";

export default function Obras() {
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [nome, setNome] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [local, setLocal] = useState("");

  async function fetchJsonSeguro(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `A rota ${url} não retornou JSON.\n\nResposta:\n${text.slice(0, 120)}`
      );
    }
  }

  async function carregarTudo() {
    try {
      const [listaObras, listaClientes] = await Promise.all([
        fetchJsonSeguro("http://localhost:3001/obras"),
        fetchJsonSeguro("http://localhost:3001/clientes"),
      ]);

      setObras(Array.isArray(listaObras) ? listaObras : []);
      setClientes(Array.isArray(listaClientes) ? listaClientes : []);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  async function salvar() {
    try {
      if (!nome.trim()) {
        alert("Informe o nome da obra");
        return;
      }

      await fetchJsonSeguro("http://localhost:3001/obras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          clienteId: Number(clienteId || 0),
          local,
        }),
      });

      setNome("");
      setClienteId("");
      setLocal("");

      carregarTudo();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar obra");
    }
  }

  async function excluir(id) {
    try {
      await fetchJsonSeguro(`http://localhost:3001/obras/${id}`, {
        method: "DELETE",
      });

      carregarTudo();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir obra");
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Obras</h1>

      {/* FORM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 2fr auto",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Nome da obra"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: 8 }}
        />

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <input
          placeholder="Local da obra"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          style={{ padding: 8 }}
        />

        <button
          onClick={salvar}
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Salvar
        </button>
      </div>

      {/* TABELA */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Obra</th>
            <th>Cliente</th>
            <th>Local</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {obras.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: 10 }}>
                Nenhuma obra cadastrada
              </td>
            </tr>
          ) : (
            obras.map((o) => (
              <tr key={o.id}>
                <td style={{ padding: 8 }}>{o.id}</td>
                <td style={{ padding: 8 }}>{o.nome}</td>
                <td style={{ padding: 8 }}>{o.clienteNome}</td>
                <td style={{ padding: 8 }}>{o.local}</td>

                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => excluir(o.id)}
                    style={{
                      padding: "6px 10px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}