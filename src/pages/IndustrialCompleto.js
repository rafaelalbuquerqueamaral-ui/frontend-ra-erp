import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:3001";

export default function IndustrialCompleto() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState("");
  const [dados, setDados] = useState(null);

  const [novoMaterial, setNovoMaterial] = useState({
    tipologia_id: "",
    tipo_item: "perfil",
    perfil_id: "",
    vidro_id: "",
    acessorio_id: "",
    descricao: "",
    qtd_formula: "",
    comprimento_formula: "",
    largura_desconto_mm: 0,
    altura_desconto_mm: 0,
    observacao: ""
  });

  const refMateriais = useRef(null);
  const refCorte = useRef(null);

  useEffect(() => {
    carregarBases();
  }, []);

  async function carregarBases() {
    const [o, t, p, v, a] = await Promise.all([
      fetch(`${API}/orcamentos`),
      fetch(`${API}/tipologias`),
      fetch(`${API}/perfis`),
      fetch(`${API}/vidros`),
      fetch(`${API}/acessorios`)
    ]);

    setOrcamentos(await o.json());
    setTipologias(await t.json());
    setPerfis(await p.json());
    setVidros(await v.json());
    setAcessorios(await a.json());
  }

  async function gerarIndustrial() {
    if (!orcamentoSelecionado) {
      alert("Selecione um orçamento");
      return;
    }

    const res = await fetch(`${API}/orcamentos/${orcamentoSelecionado}/materiais`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar módulo industrial");
      return;
    }

    setDados(data);
  }

  async function salvarMaterialTipologia() {
    if (!novoMaterial.tipologia_id || !novoMaterial.tipo_item) {
      alert("Preencha tipologia e tipo");
      return;
    }

    const payload = { ...novoMaterial };

    if (payload.tipo_item !== "perfil") payload.perfil_id = null;
    if (payload.tipo_item !== "vidro") payload.vidro_id = null;
    if (payload.tipo_item !== "acessorio") payload.acessorio_id = null;

    const res = await fetch(`${API}/tipologia-materiais`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar material");
      return;
    }

    alert("Material vinculado à tipologia com sucesso");
    setNovoMaterial({
      tipologia_id: "",
      tipo_item: "perfil",
      perfil_id: "",
      vidro_id: "",
      acessorio_id: "",
      descricao: "",
      qtd_formula: "",
      comprimento_formula: "",
      largura_desconto_mm: 0,
      altura_desconto_mm: 0,
      observacao: ""
    });
  }

  async function gerarPDF(ref, nome) {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const margem = 10;
    const imgWidth = pdfWidth - margem * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margem;

    pdf.addImage(imgData, "PNG", margem, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - margem * 2);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margem;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margem, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - margem * 2);
    }

    pdf.save(nome);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Industrial Completo V2</h1>

      <div style={box}>
        <h2>Cadastro visual de materiais por tipologia</h2>

        <div style={grid2}>
          <select
            value={novoMaterial.tipologia_id}
            onChange={(e) => setNovoMaterial({ ...novoMaterial, tipologia_id: e.target.value })}
            style={input}
          >
            <option value="">Tipologia</option>
            {tipologias.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>

          <select
            value={novoMaterial.tipo_item}
            onChange={(e) => setNovoMaterial({ ...novoMaterial, tipo_item: e.target.value })}
            style={input}
          >
            <option value="perfil">Perfil</option>
            <option value="vidro">Vidro</option>
            <option value="acessorio">Acessório</option>
          </select>

          {novoMaterial.tipo_item === "perfil" && (
            <select
              value={novoMaterial.perfil_id}
              onChange={(e) => setNovoMaterial({ ...novoMaterial, perfil_id: e.target.value })}
              style={input}
            >
              <option value="">Perfil</option>
              {perfis.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          )}

          {novoMaterial.tipo_item === "vidro" && (
            <select
              value={novoMaterial.vidro_id}
              onChange={(e) => setNovoMaterial({ ...novoMaterial, vidro_id: e.target.value })}
              style={input}
            >
              <option value="">Vidro</option>
              {vidros.map((v) => (
                <option key={v.id} value={v.id}>{v.nome}</option>
              ))}
            </select>
          )}

          {novoMaterial.tipo_item === "acessorio" && (
            <select
              value={novoMaterial.acessorio_id}
              onChange={(e) => setNovoMaterial({ ...novoMaterial, acessorio_id: e.target.value })}
              style={input}
            >
              <option value="">Acessório</option>
              {acessorios.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
          )}

          <input
            placeholder="Descrição"
            value={novoMaterial.descricao}
            onChange={(e) => setNovoMaterial({ ...novoMaterial, descricao: e.target.value })}
            style={input}
          />

          <input
            placeholder="Fórmula da quantidade"
            value={novoMaterial.qtd_formula}
            onChange={(e) => setNovoMaterial({ ...novoMaterial, qtd_formula: e.target.value })}
            style={input}
          />

          {novoMaterial.tipo_item === "perfil" && (
            <input
              placeholder="Fórmula do comprimento"
              value={novoMaterial.comprimento_formula}
              onChange={(e) => setNovoMaterial({ ...novoMaterial, comprimento_formula: e.target.value })}
              style={input}
            />
          )}

          {novoMaterial.tipo_item === "vidro" && (
            <>
              <input
                placeholder="Desconto largura mm"
                type="number"
                value={novoMaterial.largura_desconto_mm}
                onChange={(e) => setNovoMaterial({ ...novoMaterial, largura_desconto_mm: e.target.value })}
                style={input}
              />
              <input
                placeholder="Desconto altura mm"
                type="number"
                value={novoMaterial.altura_desconto_mm}
                onChange={(e) => setNovoMaterial({ ...novoMaterial, altura_desconto_mm: e.target.value })}
                style={input}
              />
            </>
          )}

          <input
            placeholder="Observação"
            value={novoMaterial.observacao}
            onChange={(e) => setNovoMaterial({ ...novoMaterial, observacao: e.target.value })}
            style={input}
          />
        </div>

        <button onClick={salvarMaterialTipologia}>Salvar material na tipologia</button>
      </div>

      <div style={box}>
        <h2>Gerar industrial do orçamento</h2>

        <select
          value={orcamentoSelecionado}
          onChange={(e) => setOrcamentoSelecionado(e.target.value)}
          style={{ ...input, maxWidth: 420 }}
        >
          <option value="">Selecione o orçamento</option>
          {orcamentos.map((o) => (
            <option key={o.id} value={o.id}>
              #{o.id} - {o.cliente_nome} - {o.tipologia_nome}
            </option>
          ))}
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={gerarIndustrial}>Gerar materiais + corte</button>
        </div>
      </div>

      {dados && (
        <>
          <div ref={refMateriais} style={box}>
            <h2>PDF técnico de materiais</h2>
            <div><strong>Orçamento:</strong> #{dados.orcamento.id}</div>
            <div><strong>Cliente:</strong> {dados.orcamento.cliente_nome}</div>
            <div><strong>Tipologia:</strong> {dados.orcamento.tipologia_nome}</div>

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: 15 }}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Comp./Medida</th>
                  <th>Metros/Área</th>
                  <th>Peso</th>
                  <th>Custo</th>
                  <th>Obs.</th>
                </tr>
              </thead>
              <tbody>
                {dados.materiais.map((item, i) => (
                  <tr key={i}>
                    <td>{item.tipo}</td>
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
                    <td>{item.observacao || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20 }}>
              <strong>Totais:</strong><br />
              Perfis: R$ {Number(dados.totais.perfis).toFixed(2)}<br />
              Vidros: R$ {Number(dados.totais.vidros).toFixed(2)}<br />
              Acessórios: R$ {Number(dados.totais.acessorios).toFixed(2)}<br />
              Geral: R$ {Number(dados.totais.geral).toFixed(2)}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button onClick={() => gerarPDF(refMateriais, `materiais-orcamento-${dados.orcamento.id}.pdf`)}>
              PDF de Materiais
            </button>
          </div>

          <div ref={refCorte} style={box}>
            <h2>PDF lista de corte</h2>

            <h3>Peças agrupadas</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: 20 }}>
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

            <h3>Plano de corte</h3>
            {dados.corte.map((grupo, i) => (
              <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
                <strong>{grupo.perfil_nome}</strong>
                {grupo.barras.map((barra, idx) => (
                  <div key={idx} style={{ marginTop: 10, paddingLeft: 10 }}>
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

            <h3>Desperdício em R$</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Sobra mm</th>
                  <th>Sobra m</th>
                  <th>Peso kg</th>
                  <th>Custo da sobra</th>
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

          <div>
            <button onClick={() => gerarPDF(refCorte, `corte-orcamento-${dados.orcamento.id}.pdf`)}>
              PDF da Lista de Corte
            </button>
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

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 10
};

const input = {
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 6,
  width: "100%"
};