import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function TipologiaVisualMateriais() {
  const [tipologias, setTipologias] = useState([]);
  const [tipologiaId, setTipologiaId] = useState("");
  const [dados, setDados] = useState(null);

  useEffect(() => {
    carregarTipologias();
  }, []);

  async function carregarTipologias() {
    const res = await fetch(`${API}/tipologias`);
    const data = await res.json();
    setTipologias(Array.isArray(data) ? data : []);
  }

  async function gerar() {
    if (!tipologiaId) {
      alert("Selecione uma tipologia");
      return;
    }

    const res = await fetch(`${API}/tipologias/${tipologiaId}/gerar-materiais-visual`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar materiais da tipologia visual");
      return;
    }

    setDados(data);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Tipologia Visual → Materiais Automáticos</h1>

      <div style={box}>
        <select
          value={tipologiaId}
          onChange={(e) => setTipologiaId(e.target.value)}
          style={input}
        >
          <option value="">Selecione a tipologia</option>
          {tipologias.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>

        <button onClick={gerar} style={button}>
          Gerar Materiais Automáticos
        </button>
      </div>

      {dados && (
        <>
          <div style={box}>
            <h2>Resumo</h2>
            <div><strong>Tipologia:</strong> {dados.tipologia.nome}</div>
            <div><strong>Módulos finais:</strong> {dados.modulos.length}</div>
            <div><strong>Total Perfis:</strong> R$ {Number(dados.totais.perfis).toFixed(2)}</div>
            <div><strong>Total Vidros:</strong> R$ {Number(dados.totais.vidros).toFixed(2)}</div>
            <div><strong>Total Acessórios:</strong> R$ {Number(dados.totais.acessorios).toFixed(2)}</div>
            <div><strong>Total Geral:</strong> R$ {Number(dados.totais.geral).toFixed(2)}</div>
          </div>

          <div style={box}>
            <h2>Módulos da Tipologia</h2>
            <table border="1" cellPadding="8" style={table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Largura</th>
                  <th>Altura</th>
                </tr>
              </thead>
              <tbody>
                {dados.modulos.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.tipo}</td>
                    <td>{Math.round(m.w)} mm</td>
                    <td>{Math.round(m.h)} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={box}>
            <h2>Materiais Gerados</h2>
            <table border="1" cellPadding="8" style={table}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Módulo</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Comprimento / Medida</th>
                  <th>Área / Metros</th>
                  <th>Peso</th>
                  <th>Custo</th>
                </tr>
              </thead>
              <tbody>
                {dados.materiais.map((item, i) => (
                  <tr key={i}>
                    <td>{item.tipo}</td>
                    <td>{item.modulo_tipo}</td>
                    <td>{item.descricao}</td>
                    <td>{item.qtd_pecas || item.qtd_folhas || item.quantidade_item || "-"}</td>
                    <td>
                      {item.comprimento_mm
                        ? `${item.comprimento_mm} mm`
                        : item.largura_mm
                        ? `${item.largura_mm} x ${item.altura_mm} mm`
                        : item.unidade || "-"}
                    </td>
                    <td>{item.metros_totais || item.area_total_m2 || "-"}</td>
                    <td>{item.peso_total_kg || "-"}</td>
                    <td>R$ {Number(item.custo_total || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={box}>
            <h2>Peças Agrupadas</h2>
            <table border="1" cellPadding="8" style={table}>
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Descrição</th>
                  <th>Comprimento</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {dados.pecas_agrupadas.map((p, i) => (
                  <tr key={i}>
                    <td>{p.perfil_nome}</td>
                    <td>{p.descricao}</td>
                    <td>{p.comprimento_mm} mm</td>
                    <td>{p.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={box}>
            <h2>Lista de Corte</h2>
            {dados.corte.map((grupo, i) => (
              <div key={i} style={{ marginBottom: 20, border: "1px solid #ddd", padding: 12 }}>
                <strong>{grupo.perfil_nome}</strong>

                {grupo.barras.map((barra, idx) => (
                  <div key={idx} style={{ marginTop: 10 }}>
                    <div>
                      Barra {idx + 1} - {barra.comprimento_barra_mm} mm - sobra {barra.sobra_mm} mm
                    </div>

                    <ul>
                      {barra.pecas.map((peca, pidx) => (
                        <li key={pidx}>
                          {peca.descricao} - {peca.comprimento_mm} mm
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={box}>
            <h2>Desperdício</h2>
            <table border="1" cellPadding="8" style={table}>
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Sobra mm</th>
                  <th>Sobra m</th>
                  <th>Peso sobra</th>
                  <th>Custo sobra</th>
                </tr>
              </thead>
              <tbody>
                {dados.desperdicio.map((d, i) => (
                  <tr key={i}>
                    <td>{d.perfil_nome}</td>
                    <td>{d.sobra_total_mm}</td>
                    <td>{d.sobra_total_m}</td>
                    <td>{d.peso_sobra_kg}</td>
                    <td>R$ {Number(d.custo_sobra).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const box = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  marginBottom: 20
};

const input = {
  padding: 10,
  marginRight: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  minWidth: 260
};

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

const table = {
  borderCollapse: "collapse",
  width: "100%"
};