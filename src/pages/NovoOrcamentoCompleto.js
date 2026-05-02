import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NovoOrcamentoCompleto() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [cores, setCores] = useState([]);

  const [cliente, setCliente] = useState("");
  const [tipologia, setTipologia] = useState("");
  const [cor, setCor] = useState("");
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [margemLucro, setMargemLucro] = useState("30");

  const [tipologiaSelecionada, setTipologiaSelecionada] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/clientes").then((r) => r.json()).then(setClientes);
    fetch("http://localhost:3001/tipologias").then((r) => r.json()).then(setTipologias);
    fetch("http://localhost:3001/cores").then((r) => r.json()).then(setCores);
  }, []);

  function selecionarTipologia(nomeTipologia) {
    setTipologia(nomeTipologia);
    const tip = tipologias.find((t) => t.nome === nomeTipologia) || null;
    setTipologiaSelecionada(tip);
  }

  const larguraNum = Number(largura || 0);
  const alturaNum = Number(altura || 0);
  const folhas = Number(tipologiaSelecionada?.folhas || 1);
  const larguraFolha = folhas > 0 ? larguraNum / folhas : 0;

  function calcularComprimento(formula) {
    if (formula === "largura") return larguraNum;
    if (formula === "altura") return alturaNum;
    if (formula === "largura/folhas") return larguraFolha;
    return 0;
  }

  function otimizarBarras(listaPerfis) {
    const BARRA = 6000;

    const pecasExpandida = [];

    listaPerfis.forEach((item) => {
      for (let i = 0; i < Number(item.quantidade || 0); i++) {
        pecasExpandida.push({
          peca: item.peca,
          nome: item.nome,
          medida: Number(item.comprimentoMm || 0),
        });
      }
    });

    pecasExpandida.sort((a, b) => b.medida - a.medida);

    const barras = [];

    pecasExpandida.forEach((peca) => {
      let alocada = false;

      for (const barra of barras) {
        const usado = barra.pecas.reduce((soma, p) => soma + p.medida, 0);
        const sobraAtual = BARRA - usado;

        if (peca.medida <= sobraAtual) {
          barra.pecas.push(peca);
          alocada = true;
          break;
        }
      }

      if (!alocada) {
        barras.push({
          pecas: [peca],
        });
      }
    });

    const barrasDetalhadas = barras.map((barra, index) => {
      const totalUsado = barra.pecas.reduce((soma, p) => soma + p.medida, 0);
      const sobra = BARRA - totalUsado;

      return {
        barra: index + 1,
        totalUsado,
        sobra,
        pecas: barra.pecas,
      };
    });

    const resumoPorPeca = [];

    listaPerfis.forEach((item) => {
      const totalMm = Number(item.comprimentoMm) * Number(item.quantidade);
      const barrasNecessarias = Math.ceil(totalMm / BARRA);
      const sobraMm = barrasNecessarias * BARRA - totalMm;

      resumoPorPeca.push({
        peca: item.peca,
        barras: barrasNecessarias,
        sobraMm,
      });
    });

    return {
      barrasDetalhadas,
      resumoPorPeca,
    };
  }

  const vidroPadrao = tipologiaSelecionada?.vidroPadrao || null;
  const area = (larguraNum / 1000) * (alturaNum / 1000);

  const vidroCalculado = vidroPadrao
    ? {
        ...vidroPadrao,
        area,
        valorTotal: area * Number(vidroPadrao.valor || 0),
      }
    : null;

  const perfisCalculados = (tipologiaSelecionada?.perfisComposicao || []).map((item) => {
    const comprimentoMm = calcularComprimento(item.comprimentoFormula);
    const comprimentoM = comprimentoMm / 1000;
    const pesoTotalKg =
      comprimentoM * Number(item.pesoMetro || 0) * Number(item.quantidade || 1);
    const custoTotal = pesoTotalKg * Number(item.valorKg || 0);

    return {
      ...item,
      comprimentoMm,
      comprimentoM,
      pesoTotalKg,
      custoTotal,
      valorTotal: custoTotal,
    };
  });

  const acessoriosCalculados = (tipologiaSelecionada?.acessoriosComposicao || []).map((item) => {
    const custoTotal = Number(item.valor || 0) * Number(item.quantidade || 1);

    return {
      ...item,
      custoTotal,
      valorTotal: custoTotal,
    };
  });

  const resultadoOtimizacao = otimizarBarras(perfisCalculados);
  const barrasOtimizadas = resultadoOtimizacao.barrasDetalhadas;
  const aproveitamentoPerfis = resultadoOtimizacao.resumoPorPeca;

  const valorVidro = Number(vidroCalculado?.valorTotal || 0);
  const custoPerfis = perfisCalculados.reduce((soma, item) => soma + Number(item.custoTotal), 0);
  const custoAcessorios = acessoriosCalculados.reduce((soma, item) => soma + Number(item.custoTotal), 0);
  const custoTotal = valorVidro + custoPerfis + custoAcessorios;

  const pesoTotalPerfis = perfisCalculados.reduce((soma, item) => soma + Number(item.pesoTotalKg), 0);

  const lucro = custoTotal * (Number(margemLucro || 0) / 100);
  const valorTotal = custoTotal + lucro;

  const corte = perfisCalculados.map((item) => ({
    peca: item.peca,
    quantidade: item.quantidade,
    medida: `${Number(item.comprimentoMm).toFixed(0)} mm`,
  }));

  async function salvar() {
    const resposta = await fetch("http://localhost:3001/orcamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        tipologia,
        cor,
        largura: larguraNum,
        altura: alturaNum,
        folhas,
        vidro: vidroPadrao,
        vidroCalculado,
        perfisCalculados,
        aproveitamentoPerfis,
        barrasOtimizadas,
        acessoriosCalculados,
        corte,
        pesoTotalPerfis,
        valorVidro,
        valorPerfis: custoPerfis,
        valorAcessorios: custoAcessorios,
        custoTotal,
        lucro,
        valorTotal,
      }),
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      alert(data.erro || "Erro ao salvar orçamento");
      return;
    }

    alert("Orçamento salvo com sucesso");
    navigate("/orcamentos");
  }

  return (
    <div>
      <h1>Novo Orçamento Completo</h1>

      <div style={{ marginBottom: "10px" }}>
        <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
          <option value="">Selecione o cliente</option>
          {clientes.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>

        <select
          value={tipologia}
          onChange={(e) => selecionarTipologia(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">Selecione a tipologia</option>
          {tipologias.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>

        <select value={cor} onChange={(e) => setCor(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="">Selecione a cor</option>
          {cores.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Largura (mm)"
          type="number"
          value={largura}
          onChange={(e) => setLargura(e.target.value)}
        />

        <input
          placeholder="Altura (mm)"
          type="number"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          placeholder="Margem de lucro %"
          type="number"
          value={margemLucro}
          onChange={(e) => setMargemLucro(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {tipologiaSelecionada && (
        <>
          <h2>Tipologia</h2>
          {tipologiaSelecionada.imagem && (
            <img
              src={tipologiaSelecionada.imagem}
              alt={tipologiaSelecionada.nome}
              width="120"
              height="120"
            />
          )}
          <p><strong>Nome:</strong> {tipologiaSelecionada.nome}</p>
          <p><strong>Folhas:</strong> {folhas}</p>

          <h2>Vidro</h2>
          {vidroPadrao ? (
            <>
              {vidroPadrao.imagem && (
                <img src={vidroPadrao.imagem} alt={vidroPadrao.nome} width="100" height="100" />
              )}
              <p>{vidroPadrao.nome}</p>
              <p>Área: {area.toFixed(3)} m²</p>
              <p>Custo: R$ {valorVidro.toFixed(2)}</p>
            </>
          ) : (
            <p>Sem vidro padrão.</p>
          )}

          <h2>Perfis Calculados</h2>
          <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Perfil</th>
                <th>Peça</th>
                <th>Comprimento</th>
                <th>Qtd</th>
                <th>Peso Total</th>
                <th>Custo</th>
              </tr>
            </thead>
            <tbody>
              {perfisCalculados.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} width="60" height="60" />
                    ) : (
                      "Sem imagem"
                    )}
                  </td>
                  <td>{item.nome}</td>
                  <td>{item.peca}</td>
                  <td>{Number(item.comprimentoMm).toFixed(0)} mm</td>
                  <td>{item.quantidade}</td>
                  <td>{item.pesoTotalKg.toFixed(3)} kg</td>
                  <td>R$ {item.custoTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Resumo por peça (barra 6m)</h2>
          <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Peça</th>
                <th>Barras</th>
                <th>Sobra</th>
              </tr>
            </thead>
            <tbody>
              {aproveitamentoPerfis.map((item, index) => (
                <tr key={index}>
                  <td>{item.peca}</td>
                  <td>{item.barras}</td>
                  <td>{item.sobraMm} mm</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Otimização inteligente de barras</h2>
          <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Barra</th>
                <th>Peças</th>
                <th>Total usado</th>
                <th>Sobra</th>
              </tr>
            </thead>
            <tbody>
              {barrasOtimizadas.map((barra) => (
                <tr key={barra.barra}>
                  <td>Barra {barra.barra}</td>
                  <td>
                    {barra.pecas.map((peca, idx) => (
                      <div key={idx}>
                        {peca.peca} - {peca.medida} mm
                      </div>
                    ))}
                  </td>
                  <td>{barra.totalUsado} mm</td>
                  <td>{barra.sobra} mm</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Acessórios Calculados</h2>
          <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Qtd</th>
                <th>Custo</th>
              </tr>
            </thead>
            <tbody>
              {acessoriosCalculados.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} width="60" height="60" />
                    ) : (
                      "Sem imagem"
                    )}
                  </td>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.custoTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Lista de Corte</h2>
          <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Peça</th>
                <th>Quantidade</th>
                <th>Medida</th>
              </tr>
            </thead>
            <tbody>
              {corte.map((item, index) => (
                <tr key={index}>
                  <td>{item.peca}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.medida}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Peso Total Perfis: {pesoTotalPerfis.toFixed(3)} kg</h2>
          <h2>Custo Vidro: R$ {valorVidro.toFixed(2)}</h2>
          <h2>Custo Perfis: R$ {custoPerfis.toFixed(2)}</h2>
          <h2>Custo Acessórios: R$ {custoAcessorios.toFixed(2)}</h2>
          <h2>Custo Total: R$ {custoTotal.toFixed(2)}</h2>
          <h2>Lucro: R$ {lucro.toFixed(2)}</h2>
          <h1>Total Venda: R$ {valorTotal.toFixed(2)}</h1>
        </>
      )}

      <button onClick={salvar}>Salvar Orçamento</button>
    </div>
  );
}