import { useEffect, useState } from "react";

export default function Acessorios() {
  const API = "http://localhost:3001";
  const vazio = {
    codigo: "",
    descricao: "",
    unidade: "UN",
    linha: "DIVERSOS",
    categoria: "",
    cor: false,
    custo: "",
    imagem: "",
  };

  const [dados, setDados] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [modal, setModal] = useState(false);
  const [busca, setBusca] = useState("");
  const [menu, setMenu] = useState(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const r = await fetch(`${API}/acessorios`);
    const d = await r.json();
    setDados(Array.isArray(d) ? d : []);
  }

  function novo() {
    setForm(vazio);
    setEditando(null);
    setModal(true);
  }

  function editar(a) {
    setForm({
      codigo: a.codigo || "",
      descricao: a.descricao || a.nome || "",
      unidade: a.unidade || "UN",
      linha: a.linha || "DIVERSOS",
      categoria: a.categoria || "",
      cor: !!a.cor,
      custo: a.custo || a.valor_unitario || "",
      imagem: a.imagem || "",
    });
    setEditando(a.id);
    setModal(true);
  }

  function copiar(a) {
    setForm({
      codigo: (a.codigo || "") + "-COPIA",
      descricao: (a.descricao || a.nome || "") + " CÓPIA",
      unidade: a.unidade || "UN",
      linha: a.linha || "DIVERSOS",
      categoria: a.categoria || "",
      cor: !!a.cor,
      custo: a.custo || a.valor_unitario || "",
      imagem: a.imagem || "",
    });
    setEditando(null);
    setModal(true);
  }

  async function salvar() {
    const url = editando ? `${API}/acessorios/${editando}` : `${API}/acessorios`;
    const method = editando ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setModal(false);
    carregar();
  }

  async function excluir(id) {
    if (!window.confirm("Excluir acessório?")) return;
    await fetch(`${API}/acessorios/${id}`, { method: "DELETE" });
    carregar();
  }

  const lista = dados.filter(a =>
    String(a.codigo || "").toLowerCase().includes(busca.toLowerCase()) ||
    String(a.descricao || a.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: 20, background: "#eef3f2", minHeight: "100vh" }}>
      <h1>Cadastros » Acessórios</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button onClick={novo} style={btn}>+ Novo Acessório</button>
        <button style={btn}>💲 Ajustar Preços</button>
        <input
          placeholder="Pesquisar por código..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ padding: 10, width: 350 }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
          <thead>
            <tr style={{ background: "#dfe9e5" }}>
              <th>Código</th><th>Descrição</th><th>Unidade</th><th>Linha</th>
              <th>Categoria</th><th>Cor</th><th>R$ Custo</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={td}>{a.codigo}</td>
                <td style={td}>{a.descricao || a.nome}</td>
                <td style={td}>{a.unidade}</td>
                <td style={td}>{a.linha}</td>
                <td style={td}>{a.categoria}</td>
                <td style={td}><input type="checkbox" checked={!!a.cor} readOnly /></td>
                <td style={td}>R$ {Number(a.custo || a.valor_unitario || 0).toFixed(2)}</td>
                <td style={{ ...td, position: "relative", textAlign: "center" }}>
                  <button onClick={() => setMenu(menu === a.id ? null : a.id)}>...</button>

                  {menu === a.id && (
                    <div style={menuBox}>
                      <b>{a.codigo}</b>
                      <div style={item} onClick={() => editar(a)}>✏️ Editar</div>
                      <div style={item} onClick={() => copiar(a)}>📋 Copiar</div>
                      <div style={item} onClick={() => excluir(a.id)}>❌ Excluir</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ background: "white", padding: 10, border: "1px solid #ccc" }}>
          <b>Imagem</b>
          <br /><br />
          <img
            alt=""
            src={lista[0]?.imagem || "https://via.placeholder.com/140"}
            width="140"
          />
        </div>
      </div>

      {modal && (
        <div style={fundo}>
          <div style={caixa}>
            <h2>{editando ? "Editar Acessório" : "Novo Acessório"}</h2>

            <input style={input} placeholder="Código" value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })} />

            <input style={input} placeholder="Descrição" value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })} />

            <input style={input} placeholder="Unidade" value={form.unidade}
              onChange={e => setForm({ ...form, unidade: e.target.value })} />

            <input style={input} placeholder="Linha" value={form.linha}
              onChange={e => setForm({ ...form, linha: e.target.value })} />

            <input style={input} placeholder="Categoria" value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })} />

            <input style={input} placeholder="R$ Custo" value={form.custo}
              onChange={e => setForm({ ...form, custo: e.target.value })} />

            <input style={input} placeholder="URL da imagem" value={form.imagem}
              onChange={e => setForm({ ...form, imagem: e.target.value })} />

            <label>
              <input type="checkbox" checked={form.cor}
                onChange={e => setForm({ ...form, cor: e.target.checked })} />
              Possui cor
            </label>

            <br /><br />

            <button onClick={salvar} style={salvarBtn}>Salvar</button>
            <button onClick={() => setModal(false)} style={cancelarBtn}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btn = { padding: 10, border: "1px solid #999", background: "#e5ecea", cursor: "pointer" };
const td = { padding: 8, fontSize: 13, borderRight: "1px solid #ddd" };
const menuBox = { position: "absolute", right: 0, top: 30, background: "#f4f4f4", border: "1px solid #777", width: 180, zIndex: 20 };
const item = { padding: 10, borderBottom: "1px solid #ccc", cursor: "pointer" };
const fundo = { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 };
const caixa = { background: "white", padding: 25, width: 420, borderRadius: 10 };
const input = { width: "100%", padding: 10, marginBottom: 8 };
const salvarBtn = { padding: 12, background: "#0f172a", color: "white", border: 0, marginRight: 10 };
const cancelarBtn = { padding: 12 };