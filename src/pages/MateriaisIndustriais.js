import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function MateriaisIndustriais() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState("");
  const [dados, setDados] = useState(null);

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  async function carregarOrcamentos() {
    const res = await fetch(`${API}/orcamentos`);
    const data = await res.json();
    setOrcamentos(Array.isArray(data) ? data : []);
  }

  async function gerarMateriais() {
    if (!orcamentoSelecionado) {
      alert("Selecione um orçamento");
      return;
    }

    const res = await fetch(`${API}/orcamentos/${orcamentoSelecionado}/materiais`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar materiais");
      return;
    }

    setDados(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Módulo Industrial</h1>

      <div style={{ marginBottom: 20 }}>
        <select
          value={orcamentoSelecionado}
          onChange={(e) => setOrcamentoSelecionado(e.target.value)}
          style={{ padding: 10, minWidth: 300, marginRight: 10 }}
        >
          <option value="">Selecione o orçamento</option>
          {orcamentos.map((o) => (
            <option key={o.id} value={o.id}>
              #{o.id} - {o.cliente_nome} - {o.tipologia_nome}
            </option>
          ))}
        </select>

        <button onClick={gerarMateriais}>Gerar Materiais</button>
      </div>

      {dados && (
        <>
          <h2>Materiais Automáticos</h2>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: 30 }}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Comprimento</th>
                <th>Metros / Área</th>
                <th>Peso</th>
                <th>Custo</th>
              </tr>
            </thead>
            <tbody>
              {dados.materiais.map((item, i) => (
                <tr key={i}>
                  <td>{item.tipo}</td>
                  <td>{item.descricao}</td>
                  <td>{item.qtd_pecas || item.qtd_folhas || "-"}</td>
                  <td>{item.comprimento_mm ? `${item.comprimento_mm} mm` : `${item.largura_mm || "-"} x ${item.altura_mm || "-"}`}</td>
                  <td>{item.metros_totais ? `${item.metros_totais} m` : `${item.area_total_m2 || 0} m²`}</td>
                  <td>{item.peso_total_kg ? `${item.peso_total_kg} kg` : "-"}</td>
                  <td>R$ {Number(item.custo_total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Lista de Corte Industrial</h2>
          {dados.corte.map((barra) => (
            <div key={barra.barra_numero} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
              <strong>Barra {barra.barra_numero}</strong> - Sobra: {barra.sobra_mm} mm
              <ul>
                {barra.pecas.map((peca, idx) => (
                  <li key={idx}>
                    {peca.descricao} - {peca.comprimento_mm} mm
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}