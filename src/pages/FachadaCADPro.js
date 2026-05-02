import React, { useMemo, useState } from "react";
import "./FachadaCADPro.css";
import FachadaPDF from "./FachadaPDF";

const TIPOS = ["FIXO", "PORTA", "MAXIM-AR", "CORRER", "PELE-VIDRO", "VAZIO"];

function criarCelula() {
  return {
    tipo: "FIXO",
    tipologia: "VIDRO FIXO",
    linha: "Gold",
    observacao: "",
    subdivisoes: [],
  };
}

export default function FachadaCADPro() {
  async function enviarParaProducao() {
  try {
    alert("Produção enviada com sucesso!");
  } catch (error) {
    console.log(error);
  }
}
  const [nome, setNome] = useState("Fachada Principal");

  const [linhas, setLinhas] = useState([
    { altura: 1200 },
    { altura: 1200 },
  ]);

  const [colunas, setColunas] = useState([
    { largura: 1000 },
    { largura: 1000 },
    { largura: 1000 },
  ]);

  const [grade, setGrade] = useState([
    [criarCelula(), criarCelula(), criarCelula()],
    [criarCelula(), criarCelula(), criarCelula()],
  ]);

  const [selecionado, setSelecionado] = useState({ row: 0, col: 0 });

  const larguraTotal = useMemo(
    () => colunas.reduce((s, c) => s + Number(c.largura || 0), 0),
    [colunas]
  );

  const alturaTotal = useMemo(
    () => linhas.reduce((s, l) => s + Number(l.altura || 0), 0),
    [linhas]
  );

  const areaTotal = ((larguraTotal * alturaTotal) / 1000000).toFixed(2);

  const materiais = useMemo(() => {
    let aluminio = 0;
    let vidro = 0;

    grade.forEach((linha, row) => {
      linha.forEach((modulo, col) => {
        if (modulo.tipo === "VAZIO") return;

        const largura = Number(colunas[col]?.largura || 0) / 1000;
        const altura = Number(linhas[row]?.altura || 0) / 1000;

        aluminio += largura * 2 + altura * 2;
        vidro += largura * altura;
      });
    });

    return {
      aluminio: aluminio.toFixed(2),
      vidro: vidro.toFixed(2),
    };
  }, [grade, colunas, linhas]);

  function alterarCelula(campo, valor) {
    const nova = grade.map((linha) => linha.map((m) => ({ ...m })));
    nova[selecionado.row][selecionado.col][campo] = valor;
    setGrade(nova);
  }

  function adicionarLinha() {
    setLinhas([...linhas, { altura: 1200 }]);
    setGrade([...grade, Array(colunas.length).fill(0).map(() => criarCelula())]);
  }

  function adicionarColuna() {
    setColunas([...colunas, { largura: 1000 }]);
    setGrade(grade.map((linha) => [...linha, criarCelula()]));
  }

  function alterarAltura(index, valor) {
    const nova = [...linhas];
    nova[index].altura = Number(valor);
    setLinhas(nova);
  }

  function alterarLargura(index, valor) {
    const nova = [...colunas];
    nova[index].largura = Number(valor);
    setColunas(nova);
  }

  function adicionarSubdivisao() {
    const nova = grade.map((linha) =>
      linha.map((m) => ({
        ...m,
        subdivisoes: [...(m.subdivisoes || [])],
      }))
    );
    async function enviarParaProducao() {
  try {
    const valorTotal = Number(materiais.vidro || 0) * 180;

    const fachadaBody = {
      nome,
      largura: larguraTotal,
      altura: alturaTotal,
      desenho_json: {
        colunas,
        linhas,
        grade,
        materiais,
      },
    };

    await fetch("http://localhost:3001/fachadas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fachadaBody),
    });

    const resOrcamento = await fetch("http://localhost:3001/orcamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente: "Cliente não informado",
        tipologia: nome,
        largura: larguraTotal,
        altura: alturaTotal,
        valor_total: valorTotal,
      }),
    });

    const orcamento = await resOrcamento.json();

    await fetch("http://localhost:3001/ordens-producao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orcamento_id: orcamento.id,
        cliente: "Cliente não informado",
        observacao: `Gerado automaticamente pela fachada ${nome}`,
        status: "EM PROJETO",
      }),
    });

    await fetch("http://localhost:3001/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: "RECEBER",
        descricao: `Orçamento automático - ${nome}`,
        categoria: "Fachada",
        valor: valorTotal,
        vencimento: new Date().toISOString().split("T")[0],
      }),
    });

    alert("Integração concluída: fachada, orçamento, produção e financeiro criados!");
  } catch (error) {
    console.log(error);
    alert("Erro na integração automática.");
  }
}

    nova[selecionado.row][selecionado.col].subdivisoes.push({
      tipo: "FIXO",
      largura: 500,
      altura: 500,
    });

    setGrade(nova);
  }

  const moduloAtual = grade[selecionado.row][selecionado.col];

  return (
    <div className="fachada-page">
      <aside className="painel-lateral">
        <h1>CAD Fachada Premium</h1>

        <label>Nome da fachada</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <div className="resumo-box">
          <p><b>Largura:</b> {larguraTotal} mm</p>
          <p><b>Altura:</b> {alturaTotal} mm</p>
          <p><b>Área:</b> {areaTotal} m²</p>
        </div>

        <button onClick={adicionarLinha}>+ Linha</button>
        <button onClick={adicionarColuna}>+ Coluna</button>
        <button onClick={adicionarSubdivisao}>+ Subdivisão</button>
        <button onClick={() => window.print()}>Gerar Prancha PDF</button>
         <button onClick={enviarParaProducao}>
  Enviar para Produção
</button>
        <div className="editor-box">
          <h3>Módulo Selecionado</h3>

          <label>Tipo</label>
          <select
            value={moduloAtual.tipo}
            onChange={(e) => alterarCelula("tipo", e.target.value)}
          >
            {TIPOS.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>

          <label>Tipologia</label>
          <input
            value={moduloAtual.tipologia}
            onChange={(e) => alterarCelula("tipologia", e.target.value)}
            placeholder="Ex: Janela 2 folhas"
          />

          <label>Linha</label>
          <select
            value={moduloAtual.linha}
            onChange={(e) => alterarCelula("linha", e.target.value)}
          >
            <option>Gold</option>
            <option>Suprema</option>
            <option>Integrada</option>
          </select>

          <label>Observação</label>
          <textarea
            value={moduloAtual.observacao}
            onChange={(e) => alterarCelula("observacao", e.target.value)}
          />
        </div>

        <div className="materiais-box">
          <h3>Materiais Automáticos</h3>
          <p><b>Perfis:</b> {materiais.aluminio} m</p>
          <p><b>Vidro:</b> {materiais.vidro} m²</p>
        </div>
      </aside>

      <main className="cad-area">
        <div className="cotas-topo">
          {colunas.map((c, index) => (
            <input
              key={index}
              value={c.largura}
              onChange={(e) => alterarLargura(index, e.target.value)}
            />
          ))}
        </div>

        <div className="cad-wrapper">
          <div className="cotas-lateral">
            {linhas.map((l, index) => (
              <input
                key={index}
                value={l.altura}
                onChange={(e) => alterarAltura(index, e.target.value)}
              />
            ))}
          </div>

          <div
            className="fachada-grid"
            style={{
              gridTemplateColumns: colunas.map(() => "160px").join(" "),
            }}
          >
            {grade.map((linha, row) =>
              linha.map((modulo, col) => {
                const ativo = selecionado.row === row && selecionado.col === col;
                async function enviarParaProducao() {
  try {
    const bodyOrcamento = {
      cliente: "Cliente não informado",
      tipologia: nome,
      largura: larguraTotal,
      altura: alturaTotal,
      valor_total: Number(materiais.vidro || 0) * 180,
    };

    const resOrc = await fetch("http://localhost:3001/orcamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyOrcamento),
    });

    const orcamento = await resOrc.json();

    const bodyOP = {
      orcamento_id: orcamento.id,
      cliente: "Cliente não informado",
      observacao: `Produção gerada automaticamente pela fachada: ${nome}`,
      status: "EM PROJETO",
    };

    await fetch("http://localhost:3001/ordens-producao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyOP),
    });

    const bodyFinanceiro = {
      tipo: "RECEBER",
      descricao: `Orçamento automático da fachada ${nome}`,
      categoria: "Fachada",
      valor: bodyOrcamento.valor_total,
      vencimento: new Date().toISOString().split("T")[0],
    };

    await fetch("http://localhost:3001/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyFinanceiro),
    });

    alert("Fachada enviada para orçamento, produção e financeiro!");
  } catch (error) {
    console.log(error);
    alert("Erro ao enviar para produção.");
  }
}

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`modulo ${ativo ? "ativo" : ""}`}
                    onClick={() => setSelecionado({ row, col })}
                  >
                    <div className="tipo-topo">{modulo.tipo}</div>
                    <div className="tipologia-centro">
                      {modulo.tipologia || "Sem tipologia"}
                    </div>
                    <div className="linha-bottom">{modulo.linha}</div>

                    {modulo.subdivisoes?.map((s, i) => (
                      <div key={i} className="subdivisao">
                        {s.tipo}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <FachadaPDF
        nome={nome}
        colunas={colunas}
        linhas={linhas}
        grade={grade}
        larguraTotal={larguraTotal}
        alturaTotal={alturaTotal}
        areaTotal={areaTotal}
        materiais={materiais}
      />
    </div>
  );
}