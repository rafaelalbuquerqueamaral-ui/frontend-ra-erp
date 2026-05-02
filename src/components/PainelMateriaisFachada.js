import { useEffect, useMemo, useState } from "react";

export default function PainelMateriaisFachada({ fachadaId }) {
  const [categoria, setCategoria] = useState("perfil");
  const [basePerfis, setBasePerfis] = useState([]);
  const [baseVidros, setBaseVidros] = useState([]);
  const [baseAcessorios, setBaseAcessorios] = useState([]);

  const [itemSelecionado, setItemSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [lista, setLista] = useState([]);

  async function carregarBases() {
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch("http://localhost:3001/perfis"),
        fetch("http://localhost:3001/vidros"),
        fetch("http://localhost:3001/acessorios"),
      ]);

      const d1 = await r1.json();
      const d2 = await r2.json();
      const d3 = await r3.json();

      setBasePerfis(Array.isArray(d1) ? d1 : []);
      setBaseVidros(Array.isArray(d2) ? d2 : []);
      setBaseAcessorios(Array.isArray(d3) ? d3 : []);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar perfis, vidros e acessórios");
    }
  }

  async function carregarLista() {
    if (!fachadaId) return;

    try {
      const res = await fetch(`http://localhost:3001/fachadas/${fachadaId}/materiais-manuais`);
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar materiais da fachada");
    }
  }

  useEffect(() => {
    carregarBases();
  }, []);

  useEffect(() => {
    carregarLista();
  }, [fachadaId]);

  const opcoes = useMemo(() => {
    if (categoria === "perfil") return basePerfis;
    if (categoria === "vidro") return baseVidros;
    return baseAcessorios;
  }, [categoria, basePerfis, baseVidros, baseAcessorios]);

  async function salvar() {
    if (!fachadaId) {
      alert("Salve a fachada primeiro");
      return;
    }

    const escolhido = opcoes.find((item) => String(item.id) === String(itemSelecionado));

    if (!escolhido) {
      alert("Selecione um item do cadastro");
      return;
    }

    if (!quantidade || Number(quantidade) <= 0) {
      alert("Informe a quantidade");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/fachadas/${fachadaId}/materiais-manuais`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria,
          nome: escolhido.nome,
          codigo: escolhido.codigo || "",
          unidade: escolhido.unidade || "un",
          quantidade: Number(quantidade || 0),
          valorUnitario: Number(escolhido.valorUnitario || 0),
          observacao,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao adicionar material");
      }

      setItemSelecionado("");
      setQuantidade("");
      setObservacao("");

      carregarLista();
    } catch (e) {
      console.error(e);
      alert("Erro ao adicionar material");
    }
  }

  async function excluir(id) {
    try {
      const res = await fetch(`http://localhost:3001/materiais-manuais/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir material");
      }

      carregarLista();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir material");
    }
  }

  return (
    <div
      style={{
        width: "360px",
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        padding: "12px",
        maxHeight: "90vh",
        overflow: "auto",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Painel Técnico da Fachada</h3>

      {!fachadaId && (
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            padding: "8px",
            borderRadius: "6px",
            marginBottom: "10px",
            fontSize: "13px",
          }}
        >
          Salve a fachada primeiro para cadastrar materiais.
        </div>
      )}

      <div style={{ display: "grid", gap: "8px" }}>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setItemSelecionado("");
          }}
          style={{ padding: "8px" }}
        >
          <option value="perfil">Alumínio / Perfil</option>
          <option value="vidro">Vidro</option>
          <option value="acessorio">Acessório</option>
        </select>

        <select
          value={itemSelecionado}
          onChange={(e) => setItemSelecionado(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">Selecione no cadastro</option>
          {opcoes.map((item) => (
            <option key={item.id} value={item.id}>
              {(item.codigo ? `${item.codigo} - ` : "") + item.nome}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{ padding: "8px" }}
        />

        <input
          placeholder="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          style={{ padding: "8px" }}
        />

        <button
          onClick={salvar}
          style={{
            padding: "10px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Adicionar do Cadastro
        </button>
      </div>

      <hr style={{ margin: "14px 0" }} />

      <div>
        <h4 style={{ marginTop: 0 }}>Materiais Vinculados à Fachada</h4>

        {lista.length === 0 ? (
          <div style={{ fontSize: "13px", color: "#475569" }}>
            Nenhum material vinculado.
          </div>
        ) : (
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Nome</th>
                <th>Qtd</th>
                <th>Un</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.categoria}</td>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.unidade}</td>
                  <td>
                    <button onClick={() => excluir(item.id)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}