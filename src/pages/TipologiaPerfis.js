import { useEffect, useState } from "react";
import { calcularFormula } from "../utils/calculoPerfil";

export default function TipologiaPerfis({ tipologiaId }) {
  const [perfis, setPerfis] = useState([]);

  const [codigo, setCodigo] = useState("");
  const [formula, setFormula] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [corte, setCorte] = useState("");
  const [condicao, setCondicao] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const largura = 1200;
  const altura = 1000;

  useEffect(() => {
    if (tipologiaId) carregar();
  }, [tipologiaId]);

  function carregar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis`)
      .then((r) => r.json())
      .then((data) => setPerfis(Array.isArray(data) ? data : []));
  }

  function salvar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo,
        formula,
        quantidade,
        descricao,
        corte,
        condicao,
        valorUnitario,
        unidade: "m",
      }),
    }).then(() => {
      carregar();
      setCodigo("");
      setFormula("");
      setQuantidade(1);
      setDescricao("");
      setCorte("");
      setCondicao("");
      setValorUnitario("");
    });
  }

  function excluir(itemId) {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis/${itemId}`, {
      method: "DELETE",
    }).then(() => carregar());
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfis da Tipologia</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 100px 1fr 1fr 120px auto", gap: 8 }}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Fórmula (ex: L-28)" value={formula} onChange={(e) => setFormula(e.target.value)} />
        <input type="number" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input placeholder="Corte" value={corte} onChange={(e) => setCorte(e.target.value)} />
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input placeholder="Condição" value={condicao} onChange={(e) => setCondicao(e.target.value)} />
        <input placeholder="Valor Unit." value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} />
        <button onClick={salvar}>Adicionar</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fórmula</th>
            <th>Qtd</th>
            <th>Medida</th>
            <th>Corte</th>
            <th>Descrição</th>
            <th>Condição</th>
            <th>Valor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {perfis.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.formula}</td>
              <td>{p.quantidade}</td>
              <td>{calcularFormula(p.formula, largura, altura)}</td>
              <td>{p.corte}</td>
              <td>{p.descricao}</td>
              <td>{p.condicao}</td>
              <td>{p.valorUnitario}</td>
              <td>
                <button onClick={() => excluir(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}