import { useEffect, useState } from "react";
import { calcularFormula } from "../utils/calculoPerfil";

export default function TipologiaAcessorios({ tipologiaId }) {
  const [acessorios, setAcessorios] = useState([]);

  const [codigo, setCodigo] = useState("");
  const [formula, setFormula] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const largura = 1200;
  const altura = 1000;

  useEffect(() => {
    if (tipologiaId) carregar();
  }, [tipologiaId]);

  function carregar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios`)
      .then((r) => r.json())
      .then((data) => setAcessorios(Array.isArray(data) ? data : []));
  }

  function salvar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        formula,
        quantidade,
        descricao,
        observacao,
        valorUnitario,
        unidade: "un",
      }),
    }).then(() => {
      carregar();
      setCodigo("");
      setFormula("");
      setQuantidade(1);
      setDescricao("");
      setObservacao("");
      setValorUnitario("");
    });
  }

  function excluir(itemId) {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios/${itemId}`, {
      method: "DELETE",
    }).then(() => carregar());
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Acessórios da Tipologia</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr 1fr 120px auto", gap: 8 }}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Fórmula (ex: 2, H/2, L/500)" value={formula} onChange={(e) => setFormula(e.target.value)} />
        <input type="number" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input placeholder="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        <input placeholder="Valor Unit." value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} />
        <button onClick={salvar}>Adicionar</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fórmula</th>
            <th>Qtd</th>
            <th>Resultado</th>
            <th>Descrição</th>
            <th>Observação</th>
            <th>Valor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {acessorios.map((a) => (
            <tr key={a.id}>
              <td>{a.codigo}</td>
              <td>{a.formula}</td>
              <td>{a.quantidade}</td>
              <td>{calcularFormula(a.formula, largura, altura)}</td>
              <td>{a.descricao}</td>
              <td>{a.observacao}</td>
              <td>{a.valorUnitario}</td>
              <td>
                <button onClick={() => excluir(a.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}