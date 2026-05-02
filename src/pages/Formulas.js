import { useEffect, useState } from "react";

export default function Formulas() {
  const [lista, setLista] = useState([]);
  const [tipologia, setTipologia] = useState("");
  const [nome, setNome] = useState("");
  const [formula, setFormula] = useState("");
  const [qtd, setQtd] = useState(1);

  const API = "http://localhost:3001";

  async function carregar() {
    const r = await fetch(API + "/formulas");
    const d = await r.json();
    setLista(d);
  }

  async function salvar() {
    await fetch(API + "/formulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipologia, nome, formula, qtd })
    });

    setNome("");
    setFormula("");
    setQtd(1);
    carregar();
  }

  async function remover(id) {
    await fetch(API + "/formulas/" + id, {
      method: "DELETE"
    });
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>⚙️ Engenharia (Formulas)</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="Tipologia" value={tipologia} onChange={e => setTipologia(e.target.value)} />
        <input placeholder="Nome do Perfil" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Formula (L, H, L-30)" value={formula} onChange={e => setFormula(e.target.value)} />
        <input type="number" value={qtd} onChange={e => setQtd(e.target.value)} />
        <button onClick={salvar}>Salvar</button>
      </div>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Tipologia</th>
            <th>Nome</th>
            <th>Formula</th>
            <th>Qtd</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map(f => (
            <tr key={f.id}>
              <td>{f.tipologia}</td>
              <td>{f.nome}</td>
              <td>{f.formula}</td>
              <td>{f.qtd}</td>
              <td>
                <button onClick={() => remover(f.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}