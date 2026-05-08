import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Vidros() {
  const [vidros, setVidros] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);

  const [formulario, setFormulario] = useState({
    id: null,
    codigo: "",
    descricao: "",
    espessura: "",
    custo_m2: "",
    categoria: "",
    grupo: "",
    largura: "",
    altura: "",
    area_minima: "",
    arredondamento: 0,
    imagem: "",
  });

  useEffect(() => {
    carregarVidros();
  }, []);

  async function carregarVidros() {
    try {
      const res = await fetch(`${API}/vidros`);
      const data = await res.json();
      setVidros(Array.isArray(data) ? data : []);
    } catch {
      alert("Erro ao carregar vidros");
    }
  }

  function novoVidro() {
    setFormulario({
      id: null,
      codigo: "",
      descricao: "",
      espessura: "",
      custo_m2: "",
      categoria: "",
      grupo: "",
      largura: "",
      altura: "",
      area_minima: "",
      arredondamento: 0,
      imagem: "",
    });
    setMostrarForm(true);
  }

  function editarVidro(item) {
    setFormulario({ ...item });
    setMostrarForm(true);
    setMenuAberto(null);
  }

  function copiarVidro(item) {
    setFormulario({
      ...item,
      id: null,
      codigo: `${item.codigo || ""}-COPIA`,
      descricao: `${item.descricao || ""} CÓPIA`,
    });
    setMostrarForm(true);
    setMenuAberto(null);
  }

  async function excluirVidro(id) {
    if (!window.confirm("Deseja excluir este vidro/chapa?")) return;

    try {
      await fetch(`${API}/vidros/${id}`, { method: "DELETE" });
      carregarVidros();
      setMenuAberto(null);
    } catch {
      alert("Erro ao excluir vidro");
    }
  }

  function converterImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormulario({ ...formulario, imagem: reader.result });
    };
    reader.readAsDataURL(file);
  }

  async function salvarVidro() {
    if (!formulario.codigo || !formulario.descricao) {
      alert("Informe código e descrição");
      return;
    }

    try {
      const metodo = formulario.id ? "PUT" : "POST";
      const url = formulario.id
        ? `${API}/vidros/${formulario.id}`
        : `${API}/vidros`;

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();

      if (data.erro) {
        alert(data.detalhe || data.erro);
        return;
      }

      setMostrarForm(false);
      carregarVidros();
      alert("Vidro salvo com sucesso!");
    } catch {
      alert("Erro ao salvar vidro");
    }
  }

  const filtrados = vidros.filter((v) => {
    const texto = `${v.codigo || ""} ${v.descricao || ""} ${v.categoria || ""} ${v.grupo || ""}`.toLowerCase();
    return texto.includes(pesquisa.toLowerCase());
  });

  return (
    <div style={page}>
      <div style={topBar}>Cadastros » Vidros / Chapas</div>

      <div style={toolbar}>
        <button style={btnNovo} onClick={novoVidro}>+ Novo Vidro / Chapa</button>
        <button
  style={btnCusto}
  onClick={() => {
    const percentual = prompt("Digite o reajuste em %. Exemplo: 10 para aumentar 10%");
    if (!percentual) return;

    const fator = 1 + Number(percentual) / 100;

    const atualizados = vidros.map((v) => ({
      ...v,
      custo_m2: Number(v.custo_m2 || 0) * fator,
    }));

    setVidros(atualizados);

    alert("Preços reajustados na tela. Para salvar no banco, vamos criar a rota de reajuste.");
  }}
>
  $ Ajustar Preços
</button>
        <div style={searchBox}>
          🔎 <b>CÓDIGO</b>
          <input
            style={searchInput}
            placeholder="PESQUISAR..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
      </div>

      {mostrarForm && (
        <div style={formBox}>
          <h3>{formulario.id ? "Editar Vidro / Chapa" : "Novo Vidro / Chapa"}</h3>

          <div style={gridForm}>
            <input style={input} placeholder="Código" value={formulario.codigo} onChange={(e) => setFormulario({ ...formulario, codigo: e.target.value })} />
            <input style={input} placeholder="Descrição" value={formulario.descricao} onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })} />
            <input style={input} placeholder="Espessura mm" type="number" value={formulario.espessura} onChange={(e) => setFormulario({ ...formulario, espessura: e.target.value })} />
            <input style={input} placeholder="Custo m² R$" type="number" value={formulario.custo_m2} onChange={(e) => setFormulario({ ...formulario, custo_m2: e.target.value })} />
            <input style={input} placeholder="Categoria" value={formulario.categoria} onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })} />
            <input style={input} placeholder="Grupo" value={formulario.grupo} onChange={(e) => setFormulario({ ...formulario, grupo: e.target.value })} />
            <input style={input} placeholder="Largura mm" type="number" value={formulario.largura} onChange={(e) => setFormulario({ ...formulario, largura: e.target.value })} />
            <input style={input} placeholder="Altura mm" type="number" value={formulario.altura} onChange={(e) => setFormulario({ ...formulario, altura: e.target.value })} />
            <input style={input} placeholder="Área mínima m²" type="number" value={formulario.area_minima} onChange={(e) => setFormulario({ ...formulario, area_minima: e.target.value })} />
            <input style={input} placeholder="Arred. mm" type="number" value={formulario.arredondamento} onChange={(e) => setFormulario({ ...formulario, arredondamento: e.target.value })} />
            <input style={input} type="file" onChange={converterImagem} />
          </div>

          {formulario.imagem && <img src={formulario.imagem} alt="" style={previewImg} />}

          <div style={actionsForm}>
            <button style={btnSalvar} onClick={salvarVidro}>Salvar Vidro</button>
            <button style={btnCancelar} onClick={() => setMostrarForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Código</th>
              <th style={th}>Descrição</th>
              <th style={th}>Espessu. mm</th>
              <th style={th}>Custo m² R$</th>
              <th style={th}>Categoria</th>
              <th style={th}>Grupo</th>
              <th style={th}>Largura mm</th>
              <th style={th}>Altura mm</th>
              <th style={th}>Área Min. m²</th>
              <th style={th}>Arred. mm</th>
              <th style={th}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((item, index) => (
              <tr key={item.id} style={index === 0 ? rowSelected : row}>
                <td style={td}>{item.codigo}</td>
                <td style={td}>{item.descricao}</td>
                <td style={td}>{item.espessura}</td>
                <td style={td}>R$ {Number(item.custo_m2 || 0).toFixed(2)}</td>
                <td style={td}>{item.categoria}</td>
                <td style={td}>{item.grupo}</td>
                <td style={td}>{item.largura}</td>
                <td style={td}>{item.altura}</td>
                <td style={td}>{item.area_minima}</td>
                <td style={td}>{item.arredondamento}</td>

                <td style={tdCenter}>
                  <div style={{ position: "relative" }}>
                    <button
                      style={btnDots}
                      onClick={() => setMenuAberto(menuAberto === item.id ? null : item.id)}
                    >
                      ...
                    </button>

                    {menuAberto === item.id && (
                      <div style={menuAcoes}>
                        <button style={menuBtn} onClick={() => editarVidro(item)}>Editar</button>
                        <button style={menuBtn} onClick={() => copiarVidro(item)}>Copiar</button>
                        <button style={menuBtnExcluir} onClick={() => excluirVidro(item.id)}>Excluir</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={footer}>
        Usuário: <b>ADMINISTRADOR</b> — {filtrados.length} vidros
      </div>
    </div>
  );
}

const page = { background: "#e5e7eb", minHeight: "100vh", fontFamily: "Arial" };
const topBar = { background: "#111827", color: "white", padding: "12px 18px", fontWeight: "bold" };
const toolbar = { display: "flex", gap: 12, background: "#f8fafc", padding: 12, borderBottom: "1px solid #cbd5e1" };
const btnNovo = { background: "#e5e7eb", border: "1px solid #94a3b8", padding: "10px 18px", fontWeight: "bold", cursor: "pointer" };
const btnCusto = { ...btnNovo, background: "white" };
const searchBox = { display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid #cbd5e1", padding: "8px 12px", width: 450 };
const searchInput = { border: "none", outline: "none", flex: 1 };
const formBox = { background: "white", margin: 14, padding: 18, border: "1px solid #cbd5e1", borderRadius: 8 };
const gridForm = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 };
const input = { padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 };
const previewImg = { marginTop: 12, width: 120, height: 90, objectFit: "contain", border: "1px solid #cbd5e1" };
const actionsForm = { marginTop: 14, display: "flex", gap: 10 };
const btnSalvar = { background: "#0f766e", color: "white", border: "none", padding: "10px 18px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" };
const btnCancelar = { background: "#111827", color: "white", border: "none", padding: "10px 18px", borderRadius: 6, cursor: "pointer" };
const tableWrap = { background: "white", border: "1px solid #cbd5e1", overflowX: "auto", margin: 14 };
const table = { width: "100%", minWidth: 1300, borderCollapse: "collapse" };
const th = { background: "#d8dfc4", padding: 10, border: "1px solid #b6bea2", textAlign: "left", fontSize: 13 };
const td = { padding: 9, border: "1px solid #d1d5db", fontSize: 13 };
const tdCenter = { ...td, textAlign: "center" };
const row = { background: "#f8fafc" };
const rowSelected = { background: "#d6c51c" };
const btnDots = { background: "#e5e7eb", border: "1px solid #9ca3af", padding: "4px 14px", cursor: "pointer" };
const menuAcoes = { position: "absolute", right: 0, top: 30, background: "white", border: "1px solid #94a3b8", zIndex: 999, minWidth: 120, boxShadow: "0 8px 20px rgba(0,0,0,.2)" };
const menuBtn = { display: "block", width: "100%", padding: 10, border: "none", background: "white", cursor: "pointer", textAlign: "left" };
const menuBtnExcluir = { ...menuBtn, color: "#dc2626", fontWeight: "bold" };
const footer = { background: "#0f172a", color: "white", padding: "8px 14px", position: "fixed", bottom: 0, left: 0, right: 0, fontSize: 12 };