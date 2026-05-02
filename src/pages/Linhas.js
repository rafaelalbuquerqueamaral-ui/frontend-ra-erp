import { useEffect, useState } from "react";
import API from "../config";

export default function Linhas() {
  const [linhas, setLinhas] = useState([]);
  const [busca, setBusca] = useState("");

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [categoria, setCategoria] = useState("Residencial");

  async function carregar() {
    try {
      const res = await fetch(API + "/linhas");
      const data = await res.json();
      setLinhas(Array.isArray(data) ? data : []);
    } catch {
      alert("Erro ao carregar linhas");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    if (!nome.trim()) {
      alert("Informe o nome da linha");
      return;
    }

    const res = await fetch(API + "/linhas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, nome, fabricante, categoria }),
    });

    if (!res.ok) {
      alert("Erro ao salvar linha");
      return;
    }

    setCodigo("");
    setNome("");
    setFabricante("");
    setCategoria("Residencial");
    carregar();
  }

  async function excluir(id) {
    if (!window.confirm("Excluir esta linha?")) return;
    await fetch(API + "/linhas/" + id, { method: "DELETE" });
    carregar();
  }

  const filtradas = linhas.filter((l) =>
    `${l.codigo || ""} ${l.nome || ""} ${l.fabricante || ""} ${l.categoria || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div style={page}>
      <div style={header}>
        <div>
          <h1>Linhas de Alumínio</h1>
          <p>Cadastro técnico de sistemas — Gold, Suprema, Integrada</p>
        </div>

        <button style={btnAzul} onClick={salvar}>
          Salvar Linha
        </button>
      </div>

      <div style={layout}>
        <section style={card}>
          <h2>Nova Linha</h2>

          <div style={preview}>
            <div style={icone}>📐</div>
            <div>
              <b>{nome || "Nome da linha"}</b>
              <p>{codigo || "Código"}</p>
              <small>{categoria}</small>
            </div>
          </div>

          <Campo label="Código">
            <input
              style={input}
              placeholder="Ex: GOLD"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </Campo>

          <Campo label="Nome da linha">
            <input
              style={input}
              placeholder="Ex: Linha Gold"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Campo>

          <Campo label="Fabricante">
            <input
              style={input}
              placeholder="Ex: Hydro / Alcoa / Perfil"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
            />
          </Campo>

          <Campo label="Categoria">
            <select
              style={input}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Residencial</option>
              <option>Comercial</option>
              <option>Alto Padrão</option>
              <option>Industrial</option>
              <option>Fachada</option>
              <option>Pele de Vidro</option>
            </select>
          </Campo>

          <button style={btnSalvar} onClick={salvar}>
            Salvar
          </button>
        </section>

        <section style={cardLista}>
          <div style={listHeader}>
            <h2>Linhas cadastradas</h2>

            <input
              style={search}
              placeholder="Buscar linha..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Código</th>
                <th style={th}>Nome</th>
                <th style={th}>Fabricante</th>
                <th style={th}>Categoria</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map((l) => (
                <tr key={l.id}>
                  <td style={td}>{l.id}</td>
                  <td style={td}><b>{l.codigo}</b></td>
                  <td style={td}>{l.nome}</td>
                  <td style={td}>{l.fabricante}</td>
                  <td style={td}>{l.categoria}</td>
                  <td style={td}>
                    <button style={btnExcluir} onClick={() => excluir(l.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {filtradas.length === 0 && (
                <tr>
                  <td style={td} colSpan="6">
                    Nenhuma linha cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label style={campo}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

const page = { fontFamily: "Arial" };

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const layout = {
  display: "grid",
  gridTemplateColumns: "360px 1fr",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

const cardLista = {
  ...card,
  overflow: "auto",
};

const preview = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  background: "#f8fafc",
  border: "1px dashed #94a3b8",
  borderRadius: 12,
  padding: 15,
  marginBottom: 15,
};

const icone = {
  width: 60,
  height: 60,
  borderRadius: 12,
  background: "#dbeafe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
};

const campo = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 12,
};

const labelStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: "#475569",
  marginBottom: 5,
};

const input = {
  padding: 11,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
};

const btnAzul = {
  padding: "12px 18px",
  border: "none",
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSalvar = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
};

const listHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const search = {
  padding: 11,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  width: 260,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  background: "#e2e8f0",
  border: "1px solid #cbd5e1",
  padding: 10,
  textAlign: "left",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 9,
};

const btnExcluir = {
  padding: "7px 10px",
  border: "none",
  borderRadius: 8,
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};