import { useState } from "react";

export default function FormulasPerfis() {
  const [perfil, setPerfil] = useState("");
  const [formula, setFormula] = useState("");
  const [formulas, setFormulas] = useState([]);

  const variaveis = [
    "L", // largura total
    "H", // altura total
    "X", // qtd colunas
    "Y", // qtd linhas
    "LM", // largura módulo
    "HM", // altura módulo
    "QTD" // quantidade
  ];

  function salvar() {
    if (!perfil || !formula) return;

    setFormulas([
      ...formulas,
      {
        id: Date.now(),
        perfil,
        formula
      }
    ]);

    setPerfil("");
    setFormula("");
  }

  function remover(id) {
    setFormulas(formulas.filter(f => f.id !== id));
  }

  function testarFormula(formula) {
    try {
      const L = 3000;
      const H = 2000;
      const X = 3;
      const Y = 2;
      const LM = L / X;
      const HM = H / Y;
      const QTD = X * Y;

      const resultado = eval(formula);
      return resultado.toFixed(2);
    } catch {
      return "Erro";
    }
  }

  return (
    <div style={page}>
      <h1>Fórmulas por Perfil (Industrial)</h1>

      <div style={layout}>
        {/* ESQUERDA */}
        <div style={box}>
          <h3>Cadastrar Fórmula</h3>

          <label>Perfil</label>
          <input
            style={input}
            value={perfil}
            onChange={e => setPerfil(e.target.value)}
            placeholder="Ex: Montante"
          />

          <label>Fórmula</label>
          <input
            style={input}
            value={formula}
            onChange={e => setFormula(e.target.value)}
            placeholder="Ex: (X + 1) * H"
          />

          <button style={btn} onClick={salvar}>
            Salvar
          </button>

          <h4>Variáveis disponíveis</h4>

          <ul>
            {variaveis.map(v => (
              <li key={v}>{v}</li>
            ))}
          </ul>

          <p style={{ marginTop: 10 }}>
            Exemplo:<br />
            <code>(X + 1) * H</code>
          </p>
        </div>

        {/* DIREITA */}
        <div style={box}>
          <h3>Lista de Fórmulas</h3>

          {formulas.map(f => (
            <div key={f.id} style={item}>
              <b>{f.perfil}</b>
              <p>{f.formula}</p>

              <p>
                Resultado teste:{" "}
                <b>{testarFormula(f.formula)}</b>
              </p>

              <button onClick={() => remover(f.id)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const page = {
  padding: 20,
  background: "#f1f5f9",
  minHeight: "100vh",
  fontFamily: "Arial"
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20
};

const box = {
  background: "#fff",
  padding: 20,
  border: "1px solid #ccc"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  border: "1px solid #aaa"
};

const btn = {
  padding: 12,
  background: "#0f172a",
  color: "#fff",
  border: "none",
  width: "100%",
  marginBottom: 20
};

const item = {
  border: "1px solid #ddd",
  padding: 10,
  marginBottom: 10
};