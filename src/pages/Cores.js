import { useEffect, useState } from "react";
import API from "../config";

function moeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Cores() {
  const [cores, setCores] = useState([]);
  const [busca, setBusca] = useState("");

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Pintura");
  const [acrescimo, setAcrescimo] = useState("");

  async function carregar() {
    try {
      const res = await fetch(API + "/cores");
      const data = await res.json();
      setCores(Array.isArray(data) ? data : []);
    } catch {
      alert("Erro ao carregar cores");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    if (!nome.trim()) {
      alert("Informe o nome da cor");
      return;
    }

    const res = await fetch(API + "/cores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo,
        nome,
        tipo,
        acrescimo: Number(acrescimo || 0),
      }),
    });

    if (!res.ok) {
      alert("Erro ao salvar cor");
      return;
    }

    setCodigo("");
    setNome("");
    setTipo("Pintura");
    setAcrescimo("");
    carregar();
  }

  async function excluir(id) {
    if (!window.confirm("Excluir esta cor?")) return;
    await fetch(API + "/cores/" + id, { method: "DELETE" });
    carregar();
  }

  const filtradas = cores.filter((c) =>
    `${c.codigo || ""} ${c.nome || ""} ${c.tipo || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div style={page}>
      <div style={topo}>
        <div>
          <h1>Cores de Acabamento</h1>
          <p>Anodizado, pintura e amadeirado com acréscimo automático</p>
        </div>

        <button style={btnAzul} onClick={salvar}>
          Salvar Cor
        </button>
      </div>

      <div style={grid}>
        <section style={card}>
          <h2>Nova Cor</h2>

          <div style={preview}>
            <div style={amostra}></div>
            <div>
              <b>{nome || "Nome da cor"}</b>
              <p>{tipo}</p>
              <small>
                {acrescimo
                  ? "+" + moeda(acrescimo)
                  : "Sem acréscimo"}
              </small>
            </div>
          </div>

          <Campo label="Código">
            <input
              style={input}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: COR-01"
            />
          </Campo>

          <Campo label="Nome">
            <input
              style={input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Preto Fosco"
            />
          </Campo>

          <Campo label="Tipo">
            <select
              style={input}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option>Pintura</option>
              <option>Anodizado</option>
              <option>Fosco</option>
              <option>Brilhante</option>
              <option>Amadeirado</option>
              <option>Especial</option>
            </select>
          </Campo>

          <Campo label="Acréscimo (R$)">
            <input
              style={input}
              value={acrescimo}
              onChange={(e) => setAcrescimo(e.target.value)}
              placeholder="Ex: 30"
            />
          </Campo>

          <button style={btnSalvar} onClick={salvar}>
            Salvar Cadastro
          </button>
        </section>

        <section style={cardLista}>
          <div style={listaTopo}>
            <h2>Cores cadastradas</h2>

            <input
              style={search}
              placeholder="Buscar cor..."
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
                <th style={th}>Tipo</th>
                <th style={th}>Acréscimo</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtradas.map((c) => (
                <tr key={c.id}>
                  <td style={td}>#{c.id}</td>
                  <td style={td}><b>{c.codigo}</b></td>
                  <td style={td}>{c.nome}</td>
                  <td style={td}>{c.tipo}</td>
                  <td style={td}>
                    {c.acrescimo ? moeda(c.acrescimo) : "-"}
                  </td>
                  <td style={td}>
                    <button style={btnExcluir} onClick={() => excluir(c.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {filtradas.length === 0 && (
                <tr>
                  <td style={{ ...td, textAlign: "center" }} colSpan="6">
                    Nenhuma cor cadastrada
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

const topo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "380px 1fr",
  gap: 20,
};

const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
};

const cardLista = {
  ...card,
  overflow: "auto",
};

const preview = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  background: "#f8fafc",
  border: "1px dashed #94a3b8",
  padding: 16,
  borderRadius: 14,
  marginBottom: 18,
};

const amostra = {
  width: 60,
  height: 60,
  borderRadius: 12,
  background: "#e2e8f0",
};

const campo = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 12,
};

const labelStyle = {
  fontSize: 12,
  color: "#475569",
  fontWeight: "bold",
  marginBottom: 5,
};

const input = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
};

const btnAzul = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

const btnSalvar = {
  width: "100%",
  padding: 13,
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
};

const listaTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
};

const search = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
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
  padding: 10,
};

const btnExcluir = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};