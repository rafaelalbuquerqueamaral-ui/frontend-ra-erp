import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OtimizacaoCorte() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState(null);
  const [barraPadrao, setBarraPadrao] = useState("6");
  const [perdaSerra, setPerdaSerra] = useState("0.003");
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/orcamentos/${id}`);
      const data = await res.json();
      setOrcamento(data);
    }

    carregar();
  }, [id]);

  function calcular() {
    if (!orcamento) return;

    const barra = Number(barraPadrao || 6);
    const perda = Number(perdaSerra || 0.003);

    const perfis = (orcamento.itens || []).filter(
      (i) => i.categoria === "perfil" && i.unidade === "m"
    );

    const pecas = [];

    perfis.forEach((item) => {
      const comprimento = Number(item.comprimentoPeca || 0);
      const repeticoes = Number(item.repeticoes || 1);

      for (let i = 0; i < repeticoes; i++) {
        pecas.push({
          material: item.materialNome,
          funcao: item.funcao || "",
          comprimento,
        });
      }
    });

    pecas.sort((a, b) => b.comprimento - a.comprimento);

    const barras = [];

    pecas.forEach((peca) => {
      let encaixou = false;

      for (const barraObj of barras) {
        const totalPecas = barraObj.pecas.reduce((soma, p) => soma + p.comprimento, 0);
        const totalPerdas = barraObj.pecas.length > 0 ? barraObj.pecas.length * perda : 0;
        const totalAtual = totalPecas + totalPerdas;

        if (totalAtual + peca.comprimento + perda <= barra) {
          barraObj.pecas.push(peca);
          encaixou = true;
          break;
        }
      }

      if (!encaixou) {
        barras.push({ pecas: [peca] });
      }
    });

    const final = barras.map((b, index) => {
      const totalPecas = b.pecas.reduce((soma, p) => soma + p.comprimento, 0);
      const totalPerdas = b.pecas.length > 0 ? b.pecas.length * perda : 0;
      const totalUsado = totalPecas + totalPerdas;
      const sobra = barra - totalUsado;

      return {
        barra: index + 1,
        totalPecas,
        totalPerdas,
        totalUsado,
        sobra,
        pecas: b.pecas,
      };
    });

    setResultado(final);
  }

  useEffect(() => {
    if (orcamento) calcular();
  }, [orcamento]);

  if (!orcamento) {
    return <div>Carregando otimização...</div>;
  }

  const desperdicioTotal = resultado.reduce((soma, b) => soma + Number(b.sobra || 0), 0);

  return (
    <div>
      <h1>Otimização de Corte</h1>

      <input
        placeholder="Barra padrão"
        value={barraPadrao}
        onChange={(e) => setBarraPadrao(e.target.value)}
      />

      <input
        placeholder="Perda de serra"
        value={perdaSerra}
        onChange={(e) => setPerdaSerra(e.target.value)}
        style={{ marginLeft: "8px" }}
      />

      <button onClick={calcular} style={{ marginLeft: "8px" }}>
        Recalcular
      </button>

      <p style={{ marginTop: "20px" }}>
        <strong>Desperdício total:</strong> {Number(desperdicioTotal).toFixed(3)} m
      </p>

      {resultado.map((barra) => (
        <div
          key={barra.barra}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            background: "#fff",
          }}
        >
          <h3>Barra {barra.barra}</h3>
          <p>Total peças: {Number(barra.totalPecas).toFixed(3)} m</p>
          <p>Total perdas: {Number(barra.totalPerdas).toFixed(3)} m</p>
          <p>Total usado: {Number(barra.totalUsado).toFixed(3)} m</p>
          <p>Sobra: {Number(barra.sobra).toFixed(3)} m</p>

          <table border="1" style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Material</th>
                <th>Função</th>
                <th>Comprimento</th>
              </tr>
            </thead>
            <tbody>
              {barra.pecas.map((p, i) => (
                <tr key={i}>
                  <td>{p.material}</td>
                  <td>{p.funcao}</td>
                  <td>{Number(p.comprimento).toFixed(3)} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}