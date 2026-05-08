import { useEffect, useState } from "react";
import API from "../config";

export default function Perfis() {
  const [perfis, setPerfis] = useState([]);
  const [busca, setBusca] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linha, setLinha] = useState("Gold");
  const [grupo, setGrupo] = useState("Fachada");
  const [unidade, setUnidade] = useState("m");
  const [pesoKgM, setPesoKgM] = useState("");
  const [valorKg, setValorKg] = useState("");
  const [barraPadrao, setBarraPadrao] = useState("6000");
  const [referencia, setReferencia] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [corFixo, setCorFixo] = useState(false);
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const r = await fetch(API + "/perfis");
      const d = await r.json();
      setPerfis(Array.isArray(d) ? d : []);
    } catch {
      alert("Erro ao carregar perfis");
    }
  }

  function limpar() {
    setIdEditando(null);
    setCodigo("");
    setNome("");
    setDescricao("");
    setLinha("Gold");
    setGrupo("Fachada");
    setUnidade("m");
    setPesoKgM("");
    setValorKg("");
    setBarraPadrao("6000");
    setReferencia("");
    setFornecedor("");
    setCorFixo(false);
    setImagem("");
  }

  async function enviarImagem(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const form = new FormData();
    form.append("imagem", arquivo);

    const r = await fetch(API + "/upload", {
      method: "POST",
      body: form,
    });

    const d = await r.json();

    if (d.caminho) {
      setImagem(API + d.caminho);
    }
  }

  async function salvar() {
    if (!codigo) return alert("Informe o código");
    if (!nome) return alert("Informe o nome");

    const body = {
      codigo,
      nome,
      descricao,
      linha,
      grupo,
      unidade,
      peso_kg_m: Number(String(pesoKgM || 0).replace(",", ".")),
      valor_kg: Number(String(valorKg || 0).replace(",", ".")),
      barra_padrao_mm: Number(barraPadrao || 6000),
      referencia,
      fornecedor,
      cor_fixo: corFixo,
      imagem,
    };

    let url = API + "/perfis";
    let metodo = "POST";

    if (idEditando) {
      url = API + "/editar/perfis/" + idEditando;
      metodo = "PUT";
    }

    const r = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const d = await r.json();

    if (!r.ok) {
      return alert(d.erro || "Erro ao salvar perfil");
    }

    alert(idEditando ? "Perfil atualizado ✅" : "Perfil salvo ✅");
    limpar();
    carregar();
  }

  function editarPerfil(p) {
    setIdEditando(p.id);
    setCodigo(p.codigo || "");
    setNome(p.nome || "");
    setDescricao(p.descricao || p.nome || "");
    setLinha(p.linha || "Gold");
    setGrupo(p.grupo || "Fachada");
    setUnidade(p.unidade || "m");
    setPesoKgM(p.peso_kg_m || p.peso_kg || "");
    setValorKg(p.valor_kg || p.preco_kg || p.preco || "");
    setBarraPadrao(p.barra_padrao_mm || p.barra || "6000");
    setReferencia(p.referencia || "");
    setFornecedor(p.fornecedor || "");
    setCorFixo(Boolean(p.cor_fixo));
    setImagem(p.imagem || "");
  }

  function copiarPerfil(p) {
    setIdEditando(null);
    setCodigo((p.codigo || "") + "-COPIA");
    setNome((p.nome || "") + " Cópia");
    setDescricao(p.descricao || p.nome || "");
    setLinha(p.linha || "Gold");
    setGrupo(p.grupo || "Fachada");
    setUnidade(p.unidade || "m");
    setPesoKgM(p.peso_kg_m || p.peso_kg || "");
    setValorKg(p.valor_kg || p.preco_kg || p.preco || "");
    setBarraPadrao(p.barra_padrao_mm || p.barra || "6000");
    setReferencia(p.referencia || "");
    setFornecedor(p.fornecedor || "");
    setCorFixo(Boolean(p.cor_fixo));
    setImagem(p.imagem || "");
  }

  async function excluirPerfil(id) {
    if (!window.confirm("Excluir perfil?")) return;

    const r = await fetch(API + "/perfis/" + id, {
      method: "DELETE",
    });

    if (!r.ok) return alert("Erro ao excluir");

    carregar();
  }

  function buscarCodigo() {
    const achado = perfis.find(
      (p) => String(p.codigo || "").toLowerCase() === busca.toLowerCase()
    );

    if (!achado) return alert("Código não encontrado");

    editarPerfil(achado);
  }

  function imgSrc(img) {
    if (!img) return "";
    if (String(img).startsWith("http")) return img;
    if (String(img).startsWith("/uploads")) return API + img;
    return img;
  }

  const filtrados = perfis.filter((p) => {
    const txt = `${p.codigo || ""} ${p.nome || ""} ${p.descricao || ""}`.toLowerCase();
    return txt.includes(busca.toLowerCase());
  });

  return (
    <div style={page}>
      <h1>Cadastros » Perfis</h1>

      <div style={topo}>
        <button style={btnNovo} onClick={limpar}>+ Novo Perfil</button>

        <input
          style={inputBusca}
          placeholder="Buscar código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <button style={btnAzul} onClick={buscarCodigo}>Buscar Código</button>
      </div>

      <section style={card}>
        <h2>{idEditando ? "Editar Perfil" : "Novo Perfil"}</h2>

        <div style={preview}>
          {imagem ? (
            <img src={imgSrc(imagem)} alt="" style={imgPreview} />
          ) : (
            <div style={semImagem}>Imagem</div>
          )}

          <div>
            <b>{codigo || "Código"}</b>
            <p>{nome || "Nome do perfil"}</p>
            <small>{linha} • {grupo}</small>
          </div>
        </div>

        <div style={gridForm}>
          <input style={input} placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <input style={input} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={input} placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <select style={input} value={linha} onChange={(e) => setLinha(e.target.value)}>
            <option>Gold</option>
            <option>Suprema</option>
            <option>Integrada</option>
            <option>Fachada</option>
            <option>Atlanta</option>
          </select>

          <input style={input} placeholder="Grupo Ex: Fachada / Marco / Folha" value={grupo} onChange={(e) => setGrupo(e.target.value)} />
          <input style={input} placeholder="Unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)} />
          <input style={input} placeholder="Peso kg/m" value={pesoKgM} onChange={(e) => setPesoKgM(e.target.value)} />
          <input style={input} placeholder="Valor kg" value={valorKg} onChange={(e) => setValorKg(e.target.value)} />
          <input style={input} placeholder="Barra padrão mm" value={barraPadrao} onChange={(e) => setBarraPadrao(e.target.value)} />
          <input style={input} placeholder="Referência" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
          <input style={input} placeholder="Fornecedor" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />

          <label style={check}>
            <input type="checkbox" checked={corFixo} onChange={(e) => setCorFixo(e.target.checked)} />
            Trat./Cor Fixo
          </label>
        </div>

        <input type="file" accept="image/*" onChange={enviarImagem} />

        <div style={acoesForm}>
          <button style={btnSalvar} onClick={salvar}>
            {idEditando ? "Salvar Alterações" : "Salvar Perfil"}
          </button>

          <button style={btnCancelar} onClick={limpar}>Cancelar</button>
        </div>
      </section>

      <section style={card}>
        <h2>Perfis Cadastrados</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Imagem</th>
              <th style={th}>Perfil</th>
              <th style={th}>Descrição</th>
              <th style={th}>Peso kg/m</th>
              <th style={th}>Valor kg</th>
              <th style={th}>Barra</th>
              <th style={th}>Referência</th>
              <th style={th}>Linha</th>
              <th style={th}>Cor Fixo</th>
              <th style={th}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id}>
                <td style={td}>
                  {p.imagem ? (
                    <img src={imgSrc(p.imagem)} alt="" style={imgTabela} />
                  ) : (
                    "-"
                  )}
                </td>

                <td style={td}><b>{p.codigo}</b></td>
                <td style={td}>{p.descricao || p.nome}</td>
                <td style={td}>{p.peso_kg_m || p.peso_kg || 0}</td>
                <td style={td}>R$ {Number(p.valor_kg || p.preco_kg || p.preco || 0).toFixed(2)}</td>
                <td style={td}>{p.barra_padrao_mm || p.barra || 6000}</td>
                <td style={td}>{p.referencia || "-"}</td>
                <td style={td}>{p.linha || "-"}</td>
                <td style={td}>{p.cor_fixo ? "Sim" : "Não"}</td>

                <td style={td}>
                  <div style={acoes}>
                    <button style={btnAdicionar} onClick={() => copiarPerfil(p)}>Adicionar</button>
                    <button style={btnCopiar} onClick={() => copiarPerfil(p)}>Copiar</button>
                    <button style={btnEditar} onClick={() => editarPerfil(p)}>Editar</button>
                    <button style={btnExcluir} onClick={() => excluirPerfil(p.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td style={td} colSpan="10">Nenhum perfil encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const page = { fontFamily: "Arial" };

const topo = {
  display: "grid",
  gridTemplateColumns: "160px 1fr 160px",
  gap: 12,
  marginBottom: 18,
};

const card = {
  background: "#fff",
  padding: 22,
  borderRadius: 18,
  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
  marginBottom: 22,
};

const preview = {
  display: "flex",
  gap: 14,
  alignItems: "center",
  background: "#f8fafc",
  border: "1px dashed #94a3b8",
  padding: 15,
  borderRadius: 14,
  marginBottom: 15,
};

const semImagem = {
  width: 90,
  height: 70,
  borderRadius: 10,
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgPreview = {
  width: 90,
  height: 70,
  objectFit: "contain",
  borderRadius: 10,
  background: "#fff",
};

const gridForm = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 10,
  marginBottom: 12,
};

const input = {
  padding: 11,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  width: "100%",
  boxSizing: "border-box",
};

const inputBusca = {
  ...input,
  margin: 0,
};

const check = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: "bold",
};

const acoesForm = {
  display: "flex",
  gap: 12,
  marginTop: 14,
};

const btnNovo = {
  background: "#d9f99d",
  color: "#111827",
  border: "1px solid #84cc16",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

const btnAzul = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer",
};

const btnSalvar = {
  background: "#14b8a6",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 24px",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnCancelar = {
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 24px",
  fontWeight: "bold",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  background: "#e2e8f0",
  border: "1px solid #cbd5e1",
  padding: 8,
  textAlign: "left",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 8,
};

const imgTabela = {
  width: 60,
  height: 42,
  objectFit: "contain",
  background: "#fff",
};

const acoes = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

const btnAdicionar = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
};

const btnCopiar = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
};

const btnEditar = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
};

const btnExcluir = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
};