import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Acessorios() {
  const [acessorios, setAcessorios] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(null);

  const [formulario, setFormulario] = useState({
    id: null,
    codigo: "",
    descricao: "",
    unidade: "UN",
    linha: "",
    categoria: "",
    cor: "",
    perfil: false,
    custo: "",
    imagem: "",
  });

  useEffect(() => {
    carregarAcessorios();
  }, []);

  async function carregarAcessorios() {
    try {
      const res = await fetch(`${API}/acessorios`);
      const data = await res.json();
      setAcessorios(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Erro ao carregar acessórios");
    }
  }

  function novoAcessorio() {
    setFormulario({
      id: null,
      codigo: "",
      descricao: "",
      unidade: "UN",
      linha: "",
      categoria: "",
      cor: "",
      perfil: false,
      custo: "",
      imagem: "",
    });
    setMostrarForm(true);
  }

  function editar(item) {
    setFormulario({ ...item });
    setMostrarForm(true);
    setMenuAberto(null);
  }

  function copiar(item) {
    setFormulario({
      ...item,
      id: null,
      codigo: `${item.codigo || ""}-COPIA`,
      descricao: `${item.descricao || ""} CÓPIA`,
    });
    setMostrarForm(true);
    setMenuAberto(null);
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este acessório?")) return;

    try {
      await fetch(`${API}/acessorios/${id}`, {
        method: "DELETE",
      });

      carregarAcessorios();
      setMenuAberto(null);
    } catch (error) {
      alert("Erro ao excluir acessório");
    }
  }

  function converterImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setFormulario({
        ...formulario,
        imagem: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  async function salvarAcessorio() {
    if (!formulario.codigo || !formulario.descricao) {
      alert("Informe código e descrição");
      return;
    }

    try {
      const metodo = formulario.id ? "PUT" : "POST";
      const url = formulario.id
        ? `${API}/acessorios/${formulario.id}`
        : `${API}/acessorios`;

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();

      if (data.erro) {
        alert(data.detalhe || data.erro);
        return;
      }

      setMostrarForm(false);
      carregarAcessorios();
      alert("Acessório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar acessório");
    }
  }

  const filtrados = acessorios.filter((a) => {
    const texto = `${a.codigo || ""} ${a.descricao || ""} ${a.linha || ""} ${
      a.categoria || ""
    }`.toLowerCase();

    return texto.includes(pesquisa.toLowerCase());
  });

  const acessorioSelecionado =
    acessorios.find((a) => a.id === selecionado) || filtrados[0];

  return (
    <div style={page}>
      <div style={topBar}>Cadastros » Acessórios</div>

      <div style={toolbar}>
        <button style={btnNovo} onClick={novoAcessorio}>
          + Novo Acessório
        </button>

        <button
          style={btnCusto}
          onClick={() => alert("Ajuste de preços em massa será o próximo passo.")}
        >
          $ Ajustar Preços
        </button>

        <div style={searchBox}>
          🔎 <b>CÓDIGO</b>
          <input
            style={searchInput}
            placeholder="Pesquisar por código..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
      </div>

      {mostrarForm && (
        <div style={formBox}>
          <h3>{formulario.id ? "Editar Acessório" : "Novo Acessório"}</h3>

          <div style={gridForm}>
            <input
              style={input}
              placeholder="Código"
              value={formulario.codigo}
              onChange={(e) =>
                setFormulario({ ...formulario, codigo: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Descrição"
              value={formulario.descricao}
              onChange={(e) =>
                setFormulario({ ...formulario, descricao: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Unidade"
              value={formulario.unidade}
              onChange={(e) =>
                setFormulario({ ...formulario, unidade: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Linha"
              value={formulario.linha}
              onChange={(e) =>
                setFormulario({ ...formulario, linha: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Categoria"
              value={formulario.categoria}
              onChange={(e) =>
                setFormulario({ ...formulario, categoria: e.target.value })
              }
            />

            <input
              style={input}
              placeholder="Cor"
              value={formulario.cor}
              onChange={(e) =>
                setFormulario({ ...formulario, cor: e.target.value })
              }
            />

            <input
              style={input}
              type="number"
              placeholder="R$ Custo"
              value={formulario.custo}
              onChange={(e) =>
                setFormulario({ ...formulario, custo: e.target.value })
              }
            />

            <label style={checkLabel}>
              <input
                type="checkbox"
                checked={!!formulario.perfil}
                onChange={(e) =>
                  setFormulario({ ...formulario, perfil: e.target.checked })
                }
              />
              Perfil?
            </label>

            <input style={input} type="file" onChange={converterImagem} />
          </div>

          {formulario.imagem && (
            <img src={formulario.imagem} alt="" style={previewImg} />
          )}

          <div style={actionsForm}>
            <button style={btnSalvar} onClick={salvarAcessorio}>
              Salvar Acessório
            </button>

            <button style={btnCancelar} onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={bodyGrid}>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Código</th>
                <th style={th}>Descrição</th>
                <th style={th}>Unidade</th>
                <th style={th}>Linha</th>
                <th style={th}>Categoria</th>
                <th style={th}>Cor</th>
                <th style={th}>Perfil?</th>
                <th style={th}>R$ Custo</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelecionado(item.id)}
                  style={selecionado === item.id ? rowSelected : row}
                >
                  <td style={td}>{item.codigo}</td>
                  <td style={td}>{item.descricao}</td>
                  <td style={td}>{item.unidade}</td>
                  <td style={td}>{item.linha}</td>
                  <td style={td}>{item.categoria}</td>
                  <td style={td}>{item.cor}</td>
                  <td style={tdCenter}>
                    <input type="checkbox" checked={!!item.perfil} readOnly />
                  </td>
                  <td style={td}>R$ {Number(item.custo || 0).toFixed(2)}</td>
                  <td style={tdCenter}>
                    <div style={{ position: "relative" }}>
                      <button
                        style={btnDots}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAberto(
                            menuAberto === item.id ? null : item.id
                          );
                        }}
                      >
                        ...
                      </button>

                      {menuAberto === item.id && (
                        <div style={menuAcoes}>
                          <button
                            style={menuBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              editar(item);
                            }}
                          >
                            Editar
                          </button>

                          <button
                            style={menuBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              copiar(item);
                            }}
                          >
                            Copiar
                          </button>

                          <button
                            style={menuBtnExcluir}
                            onClick={(e) => {
                              e.stopPropagation();
                              excluir(item.id);
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside style={sideImage}>
          <h3>Imagem</h3>

          {acessorioSelecionado?.imagem ? (
            <img
              src={acessorioSelecionado.imagem}
              alt=""
              style={imgAcessorio}
            />
          ) : (
            <div style={semImagem}>Acessório</div>
          )}
        </aside>
      </div>

      <div style={footer}>
        Usuário: <b>ADMINISTRADOR</b> — {filtrados.length} acessórios
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

const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: 12,
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

const btnCusto = {
  ...btnNovo,
  background: "#ffffff",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "white",
  border: "1px solid #cbd5e1",
  padding: "8px 12px",
  width: 450,
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

const checkLabel = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: "bold",
};

const previewImg = {
  marginTop: 12,
  width: 120,
  height: 90,
  objectFit: "contain",
  border: "1px solid #cbd5e1",
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

const bodyGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 230px",
  gap: 10,
  margin: 14,
};

const tableWrap = {
  background: "white",
  border: "1px solid #cbd5e1",
  overflowX: "auto",
};

const table = {
  width: "100%",
  minWidth: 1200,
  borderCollapse: "collapse",
};

const th = {
  background: "#d8dfc4",
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
  padding: "4px 14px",
  cursor: "pointer",
};

const menuAcoes = {
  position: "absolute",
  right: 0,
  top: 30,
  background: "white",
  border: "1px solid #94a3b8",
  zIndex: 999,
  minWidth: 120,
  boxShadow: "0 8px 20px rgba(0,0,0,.2)",
};

const menuBtn = {
  display: "block",
  width: "100%",
  padding: 10,
  border: "none",
  background: "white",
  cursor: "pointer",
  textAlign: "left",
};

const menuBtnExcluir = {
  ...menuBtn,
  color: "#dc2626",
  fontWeight: "bold",
};

const sideImage = {
  background: "#efe8dc",
  border: "1px solid #cbd5e1",
  padding: 12,
};

const imgAcessorio = {
  width: "100%",
  height: 180,
  objectFit: "contain",
  background: "white",
  border: "1px solid #cbd5e1",
};

const semImagem = {
  height: 180,
  background: "white",
  border: "1px solid #cbd5e1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
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