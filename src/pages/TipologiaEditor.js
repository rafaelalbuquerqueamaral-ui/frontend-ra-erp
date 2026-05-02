import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TipologiaEditor() {
  const { id } = useParams();

  const [tipologia, setTipologia] = useState(null);
  const [componentes, setComponentes] = useState([]);

  const [categoria, setCategoria] = useState("perfil");
  const [materialId, setMaterialId] = useState("");
  const [materialNome, setMaterialNome] = useState("");
  const [unidade, setUnidade] = useState("m");
  const [funcao, setFuncao] = useState("");
  const [formula, setFormula] = useState("1");
  const [formulaRepeticoes, setFormulaRepeticoes] = useState("1");
  const [permiteTroca, setPermiteTroca] = useState(true);
  const [valorUnitario, setValorUnitario] = useState("");

  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios, setAcessorios] = useState([]);

  async function carregarTudo() {
    const [r1, r2, r3, r4, r5] = await Promise.all([
      fetch(`http://localhost:3001/tipologias/${id}`),
      fetch(`http://localhost:3001/tipologias/${id}/componentes`),
      fetch("http://localhost:3001/perfis"),
      fetch("http://localhost:3001/vidros"),
      fetch("http://localhost:3001/acessorios"),
    ]);

    setTipologia(await r1.json());
    setComponentes(await r2.json());
    setPerfis(await r3.json());
    setVidros(await r4.json());
    setAcessorios(await r5.json());
  }

  useEffect(() => {
    carregarTudo();
  }, [id]);

  function listaMateriais() {
    if (categoria === "perfil") return perfis;
    if (categoria === "vidro") return vidros;
    if (categoria === "acessorio") return acessorios;
    return [];
  }

  function selecionarMaterial(idSelecionado) {
    setMaterialId(idSelecionado);

    const material = listaMateriais().find((m) => String(m.id) === String(idSelecionado));

    if (material) {
      setMaterialNome(material.nome);
      setUnidade(material.unidade || "un");
      setValorUnitario(material.valorUnitario || 0);
      if (categoria === "perfil") {
        setFuncao(material.funcao || "");
      }
    }
  }

  async function salvarComponente() {
    const res = await fetch(`http://localhost:3001/tipologias/${id}/componentes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoria,
        materialId,
        materialNome,
        unidade,
        funcao,
        formula,
        formulaRepeticoes,
        permiteTroca,
        valorUnitario: Number(valorUnitario || 0),
      }),
    });

    if (!res.ok) {
      alert("Erro ao salvar componente");
      return;
    }

    setCategoria("perfil");
    setMaterialId("");
    setMaterialNome("");
    setUnidade("m");
    setFuncao("");
    setFormula("1");
    setFormulaRepeticoes("1");
    setPermiteTroca(true);
    setValorUnitario("");

    carregarTudo();
  }

  async function excluirComponente(componenteId) {
    await fetch(`http://localhost:3001/componentes/${componenteId}`, {
      method: "DELETE",
    });

    carregarTudo();
  }

  return (
    <div>
      <h1>Editor da Tipologia</h1>

      <p><strong>Tipologia:</strong> {tipologia?.nome}</p>
      <p><strong>Linha:</strong> {tipologia?.linha}</p>

      <hr />

      <h3>Novo Componente</h3>

      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="perfil">Perfil</option>
        <option value="vidro">Vidro</option>
        <option value="acessorio">Acessório</option>
        <option value="mao_obra">Mão de Obra</option>
      </select>

      {categoria !== "mao_obra" ? (
        <select value={materialId} onChange={(e) => selecionarMaterial(e.target.value)} style={{ marginLeft: "8px" }}>
          <option value="">Selecione</option>
          {listaMateriais().map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      ) : (
        <input
          placeholder="Nome da mão de obra"
          value={materialNome}
          onChange={(e) => setMaterialNome(e.target.value)}
          style={{ marginLeft: "8px" }}
        />
      )}

      <br /><br />

      <input placeholder="Função" value={funcao} onChange={(e) => setFuncao(e.target.value)} />
      <input placeholder="Unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)} style={{ marginLeft: "8px" }} />
      <input placeholder="Valor unitário" value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} style={{ marginLeft: "8px" }} />

      <br /><br />

      <input placeholder="Fórmula" value={formula} onChange={(e) => setFormula(e.target.value)} />
      <input placeholder="Repetições" value={formulaRepeticoes} onChange={(e) => setFormulaRepeticoes(e.target.value)} style={{ marginLeft: "8px" }} />

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={permiteTroca}
          onChange={(e) => setPermiteTroca(e.target.checked)}
        />
        Permite troca
      </label>

      <br /><br />

      <button onClick={salvarComponente}>Salvar Componente</button>

      <hr />

      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Material</th>
            <th>Função</th>
            <th>Unidade</th>
            <th>Fórmula</th>
            <th>Rep.</th>
            <th>Troca</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {componentes.map((c) => (
            <tr key={c.id}>
              <td>{c.categoria}</td>
              <td>{c.materialNome}</td>
              <td>{c.funcao}</td>
              <td>{c.unidade}</td>
              <td>{c.formula}</td>
              <td>{c.formulaRepeticoes}</td>
              <td>{c.permiteTroca ? "Sim" : "Não"}</td>
              <td>R$ {Number(c.valorUnitario || 0).toFixed(2)}</td>
              <td>
                <button onClick={() => excluirComponente(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}