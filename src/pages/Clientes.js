import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    cidade: "",
    uf: "",
    email: "",
    cpf_cnpj: "",
    rg_ie: "",
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const res = await fetch(`${API}/clientes`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Erro ao carregar clientes");
    }
  }

  function novoCliente() {
    setForm({
      nome: "",
      telefone: "",
      endereco: "",
      cidade: "",
      uf: "",
      email: "",
      cpf_cnpj: "",
      rg_ie: "",
    });
    setMostrarForm(true);
  }

  async function salvarCliente() {
    if (!form.nome) {
      alert("Informe o nome do cliente");
      return;
    }

    try {
      const res = await fetch(`${API}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.erro) {
        alert(data.detalhe || data.erro);
        return;
      }

      setMostrarForm(false);
      carregarClientes();
      alert("Cliente salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar cliente");
    }
  }

  const filtrados = clientes.filter((c) => {
    const texto = `${c.nome || ""} ${c.telefone || ""} ${c.cidade || ""} ${
      c.email || ""
    } ${c.cpf_cnpj || ""}`.toLowerCase();

    return texto.includes(pesquisa.toLowerCase());
  });

  return (
    <div style={page}>
      <div style={topBar}>
        <div style={breadcrumb}>Cadastros » Clientes</div>
      </div>

      <div style={toolbar}>
        <button style={btnNovo} onClick={novoCliente}>
          + Novo Cliente
        </button>

        <div style={searchBox}>
          <span>🔎</span>
          <input
            style={searchInput}
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
      </div>

      {mostrarForm && (
        <div style={formBox}>
          <h3>Novo Cliente</h3>

          <div style={gridForm}>
            <input
              style={input}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <input
              style={input}
              placeholder="Fone / Whats"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />

            <input
              style={input}
              placeholder="Endereço"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            />

            <input
              style={input}
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />

            <input
              style={input}
              placeholder="UF"
              value={form.uf}
              onChange={(e) => setForm({ ...form, uf: e.target.value })}
            />

            <input
              style={input}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              style={input}
              placeholder="CPF/CNPJ"
              value={form.cpf_cnpj}
              onChange={(e) => setForm({ ...form, cpf_cnpj: e.target.value })}
            />

            <input
              style={input}
              placeholder="RG/IE"
              value={form.rg_ie}
              onChange={(e) => setForm({ ...form, rg_ie: e.target.value })}
            />
          </div>

          <div style={actionsForm}>
            <button style={btnSalvar} onClick={salvarCliente}>
              Salvar Cliente
            </button>

            <button style={btnCancelar} onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Nome</th>
              <th style={th}>Fone/Whats</th>
              <th style={th}>Ações</th>
              <th style={th}>Endereço</th>
              <th style={th}>Cidade</th>
              <th style={th}>UF</th>
              <th style={th}>Email</th>
              <th style={th}>CPF/CNPJ</th>
              <th style={th}>RG/IE</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelecionado(c.id)}
                style={selecionado === c.id ? rowSelected : row}
              >
                <td style={td}>{c.nome}</td>
                <td style={td}>{c.telefone}</td>
                <td style={tdCenter}>
                  <button style={btnDots}>...</button>
                </td>
                <td style={td}>{c.endereco}</td>
                <td style={td}>{c.cidade}</td>
                <td style={td}>{c.uf}</td>
                <td style={td}>{c.email}</td>
                <td style={td}>{c.cpf_cnpj}</td>
                <td style={td}>{c.rg_ie}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={footer}>
        Usuário: <b>ADMINISTRADOR</b> — {filtrados.length} clientes
      </div>
    </div>
  );
}

const page = {
  background: "#e5e7eb",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const topBar = {
  background: "#111827",
  color: "white",
  padding: "12px 18px",
  fontWeight: "bold",
};

const breadcrumb = {
  fontSize: 15,
};

const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  background: "#f8fafc",
  padding: 12,
  borderBottom: "1px solid #cbd5e1",
};

const btnNovo = {
  background: "#e5e7eb",
  border: "1px solid #94a3b8",
  padding: "10px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "white",
  border: "1px solid #cbd5e1",
  padding: "8px 12px",
  width: 380,
};

const searchInput = {
  border: "none",
  outline: "none",
  flex: 1,
};

const formBox = {
  background: "white",
  margin: 14,
  padding: 18,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
};

const gridForm = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 10,
};

const input = {
  padding: 10,
  border: "1px solid #cbd5e1",
  borderRadius: 6,
};

const actionsForm = {
  marginTop: 14,
  display: "flex",
  gap: 10,
};

const btnSalvar = {
  background: "#0f766e",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
};

const btnCancelar = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
};

const tableWrap = {
  margin: 14,
  background: "white",
  border: "1px solid #cbd5e1",
  overflowX: "auto",
};

const table = {
  width: "100%",
  minWidth: 1250,
  borderCollapse: "collapse",
};

const th = {
  background: "#d8dfc4",
  color: "#111827",
  padding: 10,
  border: "1px solid #b6bea2",
  textAlign: "left",
  fontSize: 13,
};

const td = {
  padding: 9,
  border: "1px solid #d1d5db",
  fontSize: 13,
};

const tdCenter = {
  ...td,
  textAlign: "center",
};

const row = {
  background: "#f8fafc",
  cursor: "pointer",
};

const rowSelected = {
  background: "#d6c51c",
  cursor: "pointer",
};

const btnDots = {
  background: "#e5e7eb",
  border: "1px solid #9ca3af",
  padding: "4px 10px",
  cursor: "pointer",
};

const footer = {
  background: "#0f172a",
  color: "white",
  padding: "8px 14px",
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  fontSize: 12,
};