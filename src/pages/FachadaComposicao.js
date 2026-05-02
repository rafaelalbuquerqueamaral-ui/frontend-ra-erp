import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const tiposModulo = [
  "fixo",
  "bandeira",
  "maxim_ar",
  "porta",
  "folha_correr_esq",
  "folha_correr_dir",
];

export default function FachadaComposicao() {
  const { id } = useParams();

  const [fachada, setFachada] = useState(null);
  const [lista, setLista] = useState([]);

  const [tipoModulo, setTipoModulo] = useState("fixo");
  const [categoria, setCategoria] = useState("perfil");

  const [materialNome, setMaterialNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [unidade, setUnidade] = useState("m");
  const [valorUnitario, setValorUnitario] = useState("");
  const [formula, setFormula] = useState("(largura + altura) * 2 / 1000");
  const [formulaRepeticoes, setFormulaRepeticoes] = useState("1");

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    try {
      const rFachada = await fetch(`http://localhost:3001/fachadas/${id}`);
      const fachadaData = await rFachada.json();
      setFachada(fachadaData);

      const rComp = await fetch(`http://localhost:3001/fachadas/${id}/composicao`);
      const compData = await rComp.json();
      setLista(Array.isArray(compData) ? compData : []);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar composição");
    }
  }

  function mudarCategoria(valor) {
    setCategoria(valor);

    if (valor === "perfil") {
      setUnidade("m");
      setFormula("(largura + altura) * 2 / 1000");
      setMaterialNome("Alumínio Fachada");
      setFuncao("Marco");
    }

    if (valor === "vidro") {
      setUnidade("m2");
      setFormula("(largura * altura) / 1000000");
      setMaterialNome("Vidro Laminado 8mm");
      setFuncao("Vidro");
    }

    if (valor === "acessorio") {
      setUnidade("un");
      setFormula("1");
      setMaterialNome("Acessório");
      setFuncao("Acessório");
    }

    if (valor === "mao_obra") {
      setUnidade("m2");
      setFormula("(largura * altura) / 1000000");
      setMaterialNome("Mão de obra");
      setFuncao("Instalação");
    }
  }

  async function adicionarMaterial() {
    if (!materialNome) {
      alert("Digite o nome do material");
      return;
    }

    if (!valorUnitario) {
      alert("Digite o valor unitário");
      return;
    }

    const res = await fetch(`http://localhost:3001/fachadas/${id}/composicao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipoModulo,
        categoria,
        materialNome,
        unidade,
        funcao,
        formula,
        formulaRepeticoes,
        valorUnitario: Number(valorUnitario || 0),
      }),
    });

    if (!res.ok) {
      alert("Erro ao adicionar material");
      return;
    }

    alert("Material adicionado!");

    setMaterialNome("");
    setFuncao("");
    setValorUnitario("");
    setFormulaRepeticoes("1");

    carregar();
  }

  async function excluirMaterial(itemId) {
    await fetch(`http://localhost:3001/fachadas/composicao/${itemId}`, {
      method: "DELETE",
    });

    carregar();
  }

  return (
    <div>
      <h1>Composição Técnica da Fachada</h1>

      <p>
        <strong>Fachada:</strong> {fachada?.nome || "-"}
      </p>

      <div style={{ background: "#fff", padding: 15, border: "1px solid #ccc" }}>
        <h3>Adicionar material por tipo de módulo</h3>

        <label>Tipo do módulo</label>
        <br />
        <select value={tipoModulo} onChange={(e) => setTipoModulo(e.target.value)}>
          {tiposModulo.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Categoria</label>
        <br />
        <select value={categoria} onChange={(e) => mudarCategoria(e.target.value)}>
          <option value="perfil">Perfil</option>
          <option value="vidro">Vidro</option>
          <option value="acessorio">Acessório</option>
          <option value="mao_obra">Mão de obra</option>
        </select>

        <br />
        <br />

        <label>Nome do material</label>
        <br />
        <input
          value={materialNome}
          onChange={(e) => setMaterialNome(e.target.value)}
          placeholder="Ex: Alumínio Fachada / Fecho / Vidro 8mm"
          style={{ width: 350 }}
        />

        <br />
        <br />

        <label>Função técnica</label>
        <br />
        <input
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
          placeholder="Ex: Marco / Vidro / Fecho / Roldana"
          style={{ width: 250 }}
        />

        <br />
        <br />

        <label>Unidade</label>
        <br />
        <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
          <option value="m">m</option>
          <option value="m2">m²</option>
          <option value="un">un</option>
        </select>

        <br />
        <br />

        <label>Valor unitário</label>
        <br />
        <input
          value={valorUnitario}
          onChange={(e) => setValorUnitario(e.target.value)}
          placeholder="Ex: 45"
        />

        <br />
        <br />

        <label>Fórmula</label>
        <br />
        <input
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          style={{ width: 350 }}
        />

        <br />
        <br />

        <label>Repetições</label>
        <br />
        <input
          value={formulaRepeticoes}
          onChange={(e) => setFormulaRepeticoes(e.target.value)}
        />

        <br />
        <br />

        <button onClick={adicionarMaterial}>Adicionar Material</button>
      </div>

      <table border="1" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Tipo módulo</th>
            <th>Categoria</th>
            <th>Material</th>
            <th>Função</th>
            <th>Unidade</th>
            <th>Fórmula</th>
            <th>Rep.</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan="9">Nenhum material cadastrado</td>
            </tr>
          ) : (
            lista.map((item) => (
              <tr key={item.id}>
                <td>{item.tipoModulo}</td>
                <td>{item.categoria}</td>
                <td>{item.materialNome}</td>
                <td>{item.funcao}</td>
                <td>{item.unidade}</td>
                <td>{item.formula}</td>
                <td>{item.formulaRepeticoes}</td>
                <td>R$ {Number(item.valorUnitario || 0).toFixed(2)}</td>
                <td>
                  <button onClick={() => excluirMaterial(item.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Exemplos rápidos</h3>

      <p>
        <strong>Perfil:</strong> (largura + altura) * 2 / 1000
      </p>

      <p>
        <strong>Vidro:</strong> (largura * altura) / 1000000
      </p>

      <p>
        <strong>Acessório:</strong> 1
      </p>
    </div>
  );
}