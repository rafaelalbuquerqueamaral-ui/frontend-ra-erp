import { useEffect, useState } from "react";
import { calcularFormula } from "../utils/calculoPerfil";

export default function TipologiaVidros({ tipologiaId }) {
  const [vidros, setVidros] = useState([]);

  const [codigo, setCodigo] = useState("");
  const [formula, setFormula] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [espessura, setEspessura] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const largura = 1200;
  const altura = 1000;

  useEffect(() => {
    if (tipologiaId) carregar();
  }, [tipologiaId]);

  function carregar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros`)
      .then((r) => r.json())
      .then((data) => setVidros(Array.isArray(data) ? data : []));
  }

  function salvar() {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        formula,
        quantidade,
        descricao,
        tipo,
        espessura,
        valorUnitario,
        unidade: "m2",
      }),
    }).then(() => {
      carregar();
      setCodigo("");
      setFormula("");
      setQuantidade(1);
      setDescricao("");
      setTipo("");
      setEspessura("");
      setValorUnitario("");
    });
  }

  function excluir(itemId) {
    fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros/${itemId}`, {
      method: "DELETE",
    }).then(() => carregar());
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Vidros da Tipologia</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr 1fr 120px 120px auto", gap: 8 }}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Fórmula (ex: (L-40)*(H-40)/1000000)" value={formula} onChange={(e) => setFormula(e.target.value)} />
        <input type="number" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input placeholder="Tipo vidro" value={tipo} onChange={(e) => setTipo(e.target.value)} />
        <input placeholder="Espessura" value={espessura} onChange={(e) => setEspessura(e.target.value)} />
        <input placeholder="Valor Unit." value={valorUnitario} onChange={(e) => setValorUnitario(e.target.value)} />
        <button onClick={salvar}>Adicionar</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fórmula</th>
            <th>Qtd</th>
            <th>Área / Medida</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Espessura</th>
            <th>Valor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {vidros.map((v) => (
            <tr key={v.id}>
              <td>{v.codigo}</td>
              <td>{v.formula}</td>
              <td>{v.quantidade}</td>
              <td>{calcularFormula(v.formula, largura, altura)}</td>
              <td>{v.descricao}</td>
              <td>{v.tipo}</td>
              <td>{v.espessura}</td>
              <td>{v.valorUnitario}</td>
              <td>
                <button onClick={() => excluir(v.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}