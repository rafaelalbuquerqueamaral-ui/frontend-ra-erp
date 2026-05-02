import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MemoriaProducao() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState(null);

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/orcamentos/${id}`);
      const data = await res.json();
      setOrcamento(data);
    }

    carregar();
  }, [id]);

  if (!orcamento) {
    return <div>Carregando memória de produção...</div>;
  }

  const itens = (orcamento.itens || []).filter(
    (i) => i.categoria === "perfil" && i.unidade === "m"
  );

  const pecas = [];

  itens.forEach((item) => {
    const comprimento = Number(item.comprimentoPeca || 0);
    const repeticoes = Number(item.repeticoes || 1);

    for (let i = 0; i < repeticoes; i++) {
      pecas.push({
        material: item.materialNome,
        funcao: item.funcao || "sem_funcao",
        comprimento,
      });
    }
  });

  const mapa = {};

  pecas.forEach((p) => {
    const chave = `${p.funcao}_${p.material}_${p.comprimento.toFixed(3)}`;

    if (!mapa[chave]) {
      mapa[chave] = {
        funcao: p.funcao,
        material: p.material,
        comprimento: p.comprimento,
        quantidade: 0,
      };
    }

    mapa[chave].quantidade += 1;
  });

  const lista = Object.values(mapa);

  return (
    <div>
      <h1>Memória de Produção</h1>

      <p><strong>Cliente:</strong> {orcamento.cliente}</p>
      <p><strong>Tipologia:</strong> {orcamento.tipologiaNome}</p>

      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Função</th>
            <th>Material</th>
            <th>Comprimento</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhuma peça</td>
            </tr>
          ) : (
            lista.map((p, index) => (
              <tr key={index}>
                <td>{p.funcao}</td>
                <td>{p.material}</td>
                <td>{Number(p.comprimento).toFixed(3)} m</td>
                <td>{p.quantidade}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}