import React, { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function FachadaCAD() {

  const pranchaRef = useRef(null);

  const [aba, setAba] = useState("DESENHO");
  const [subAbaMateriais, setSubAbaMateriais] =
    useState("GERAL");

  const [largura, setLargura] = useState(6000);
  const [altura, setAltura] = useState(3000);

  const [colunas, setColunas] = useState(3);
  const [linhas, setLinhas] = useState(2);

  const [cotasX, setCotasX] = useState([
    2000,
    2000,
    2000,
  ]);

  const [cotasY, setCotasY] = useState([
    1500,
    1500,
  ]);

  const [mostrarMedidas, setMostrarMedidas] =
    useState(true);

  const [
    mostrarMateriaisModulo,
    setMostrarMateriaisModulo,
  ] = useState(true);

  const [selecionados, setSelecionados] =
    useState([]);

  const [formulaAluminio, setFormulaAluminio] =
    useState("((L + A) * 2) / 1000");

  const [formulaVidro, setFormulaVidro] =
    useState("(L * A) / 1000000");

  const [formulaAcessorio, setFormulaAcessorio] =
    useState("1");

  const [perfis] = useState([
    {
      id: 1,
      codigo: "FA-001",
      nome: "Coluna Vertical Fachada",
      unidade: "barra 6m",
      imagem: "",
    },

    {
      id: 2,
      codigo: "TR-001",
      nome: "Travessa Horizontal Fachada",
      unidade: "barra 6m",
      imagem: "",
    },

    {
      id: 3,
      codigo: "MA-001",
      nome: "Marco Maxim-ar",
      unidade: "barra 6m",
      imagem: "",
    },
  ]);

  const [vidros] = useState([
    {
      id: 1,
      codigo: "VD-001",
      nome: "Vidro Incolor 8mm",
      unidade: "m²",
      imagem: "",
    },

    {
      id: 2,
      codigo: "VD-002",
      nome: "Vidro Fumê 8mm",
      unidade: "m²",
      imagem: "",
    },

    {
      id: 3,
      codigo: "VD-003",
      nome: "Vidro Temperado 10mm",
      unidade: "m²",
      imagem: "",
    },
  ]);

  const [acessorios] = useState([
    {
      id: 1,
      codigo: "AC-001",
      nome: "Kit Fixação Fachada",
      unidade: "un",
      imagem: "",
    },

    {
      id: 2,
      codigo: "AC-002",
      nome: "Calço de Vidro",
      unidade: "un",
      imagem: "",
    },

    {
      id: 3,
      codigo: "AC-003",
      nome: "Borracha de Vedação",
      unidade: "m",
      imagem: "",
    },
  ]);

  const [modulos, setModulos] = useState({});

  function atualizarGrade(
    qtdColunas,
    qtdLinhas
  ) {

    const novaCotasX = Array.from(
      { length: qtdColunas },
      () =>
        Number(
          (largura / qtdColunas).toFixed(0)
        )
    );

    const novaCotasY = Array.from(
      { length: qtdLinhas },
      () =>
        Number(
          (altura / qtdLinhas).toFixed(0)
        )
    );

    setCotasX(novaCotasX);

    setCotasY(novaCotasY);

    setSelecionados([]);

    setModulos({});
  }

  function criarModuloPadrao(
    linha,
    coluna
  ) {

    const id = `${linha}-${coluna}`;

    return {
      id,

      linha,

      coluna,

      tipo: "FIXO",

      perfil: perfis[0],

      vidro: vidros[0],

      acessorio: acessorios[0],

      qtdPerfil: 1,

      qtdVidro: 1,

      qtdAcessorio: 1,

      formulaAluminio,

      formulaVidro,

      formulaAcessorio,
    };
  }

  const grade = useMemo(() => {

    const obj = {};

    for (let l = 0; l < linhas; l++) {

      for (let c = 0; c < colunas; c++) {

        const id = `${l}-${c}`;

        obj[id] =
          modulos[id] ||
          criarModuloPadrao(l, c);
      }
    }

    return obj;

  }, [
    linhas,
    colunas,
    modulos,
    formulaAluminio,
    formulaVidro,
    formulaAcessorio,
  ]);

  const larguraTotal = cotasX.reduce(
    (total, n) =>
      total + Number(n || 0),
    0
  );

  const alturaTotal = cotasY.reduce(
    (total, n) =>
      total + Number(n || 0),
    0
  );
  function selecionarModulo(id) {
    setSelecionados((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : [...old, id]
    );
  }

  function selecionarTodos() {
    setSelecionados(Object.keys(grade));
  }

  function limparSelecao() {
    setSelecionados([]);
  }

  function alterarCotaX(index, valor) {
    const novo = [...cotasX];

    novo[index] = Number(valor || 0);

    setCotasX(novo);

    setLargura(
      novo.reduce(
        (total, n) => total + Number(n || 0),
        0
      )
    );
  }

  function alterarCotaY(index, valor) {
    const novo = [...cotasY];

    novo[index] = Number(valor || 0);

    setCotasY(novo);

    setAltura(
      novo.reduce(
        (total, n) => total + Number(n || 0),
        0
      )
    );
  }

  function aplicarTipo(tipo) {
    if (selecionados.length === 0) {
      alert("Selecione um ou mais módulos primeiro.");
      return;
    }

    const novo = { ...grade };

    selecionados.forEach((id) => {
      novo[id] = {
        ...novo[id],
        tipo,
      };
    });

    setModulos(novo);
  }

  function aplicarMaterial(campo, item) {
    if (selecionados.length === 0) {
      alert("Selecione um ou mais módulos primeiro.");
      return;
    }

    const novo = { ...grade };

    selecionados.forEach((id) => {
      novo[id] = {
        ...novo[id],
        [campo]: item,
      };
    });

    setModulos(novo);
  }

  function aplicarFormulasSelecionadas() {
    if (selecionados.length === 0) {
      alert("Selecione um ou mais módulos primeiro.");
      return;
    }

    const novo = { ...grade };

    selecionados.forEach((id) => {
      novo[id] = {
        ...novo[id],
        formulaAluminio,
        formulaVidro,
        formulaAcessorio,
      };
    });

    setModulos(novo);
  }

  function limparMateriais() {
    const novo = { ...grade };

    Object.keys(novo).forEach((id) => {
      novo[id] = {
        ...novo[id],
        perfil: null,
        vidro: null,
        acessorio: null,
      };
    });

    setModulos(novo);
  }

  function calcularFormula(formula, L, A, Q) {
    try {
      const texto = String(formula || "0")
        .replaceAll("L", `(${Number(L || 0)})`)
        .replaceAll("A", `(${Number(A || 0)})`)
        .replaceAll("Q", `(${Number(Q || 1)})`);

      const resultado = Function(
        `"use strict"; return (${texto});`
      )();

      if (!Number.isFinite(Number(resultado))) {
        return 0;
      }

      return Number(resultado);
    } catch (error) {
      return 0;
    }
  }

  function calcularMateriais() {
    const aluminio = [];
    const vidrosLista = [];
    const acessoriosLista = [];

    Object.values(grade).forEach((m, index) => {
      const L = Number(cotasX[m.coluna] || 0);
      const A = Number(cotasY[m.linha] || 0);

      if (m.tipo === "VAZIO") return;

      if (m.perfil) {
        const qtdPecas = Number(m.qtdPerfil || 1);

        const metros = calcularFormula(
          m.formulaAluminio || formulaAluminio,
          L,
          A,
          qtdPecas
        );

        const metrosTotal = metros * qtdPecas;

        const barras = Math.ceil(metrosTotal / 6);

        const perda = barras * 6 - metrosTotal;

        aluminio.push({
          imagem: m.perfil.imagem,
          modulo: index + 1,
          categoria: "ALUMÍNIO",
          codigo: m.perfil.codigo || "SEM CÓDIGO",
          descricao:
            m.perfil.nome || "Perfil não definido",
          unidade: "barra 6m",
          largura: L,
          altura: A,
          formula:
            m.formulaAluminio || formulaAluminio,
          qtdPecas,
          metrosUnit: metros,
          metros: metrosTotal,
          barras,
          perda,
        });
      }

      if (m.vidro) {
        const qtdPecas = Number(m.qtdVidro || 1);

        const areaUn = calcularFormula(
          m.formulaVidro || formulaVidro,
          L,
          A,
          qtdPecas
        );

        const areaTotal = areaUn * qtdPecas;

        vidrosLista.push({
          imagem: m.vidro.imagem,
          modulo: index + 1,
          categoria: "VIDRO",
          codigo: m.vidro.codigo || "SEM CÓDIGO",
          descricao:
            m.vidro.nome || "Vidro não definido",
          unidade: "peça / m²",
          largura: L,
          altura: A,
          formula: m.formulaVidro || formulaVidro,
          qtdPecas,
          areaUn,
          m2: areaTotal,
        });
      }

      if (m.acessorio) {
        const qtdBase = calcularFormula(
          m.formulaAcessorio || formulaAcessorio,
          L,
          A,
          1
        );

        const qtdPecas = Number(
          m.qtdAcessorio || 1
        );

        const qtdTotal = qtdBase * qtdPecas;

        acessoriosLista.push({
          imagem: m.acessorio.imagem,
          modulo: index + 1,
          categoria: "ACESSÓRIO",
          codigo:
            m.acessorio.codigo || "SEM CÓDIGO",
          descricao:
            m.acessorio.nome ||
            "Acessório não definido",
          unidade: m.acessorio.unidade || "un",
          largura: L,
          altura: A,
          formula:
            m.formulaAcessorio ||
            formulaAcessorio,
          qtdPecas,
          qtd: qtdTotal,
        });
      }
    });

    return {
      aluminio,
      vidros: vidrosLista,
      acessorios: acessoriosLista,
      geral: [
        ...aluminio,
        ...vidrosLista,
        ...acessoriosLista,
      ],
    };
  }

  const materiais = calcularMateriais();

  const resumo = {
    barras: materiais.aluminio.reduce(
      (s, m) => s + Number(m.barras || 0),
      0
    ),

    metros: materiais.aluminio.reduce(
      (s, m) => s + Number(m.metros || 0),
      0
    ),

    perda: materiais.aluminio.reduce(
      (s, m) => s + Number(m.perda || 0),
      0
    ),

    pecasVidro: materiais.vidros.reduce(
      (s, m) => s + Number(m.qtdPecas || 0),
      0
    ),

    m2: materiais.vidros.reduce(
      (s, m) => s + Number(m.m2 || 0),
      0
    ),

    acessorios: materiais.acessorios.reduce(
      (s, m) => s + Number(m.qtd || 0),
      0
    ),
  };
 async function gerarPDF() {
  const elemento = pranchaRef.current;

  const canvas = await html2canvas(elemento, {
    scale: 3,
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: elemento.scrollWidth,
    windowHeight: elemento.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "mm",
    format: "a3",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth - 10;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let alturaRestante = imgHeight;
  let posicaoY = 5;

  pdf.addImage(imgData, "PNG", 5, posicaoY, imgWidth, imgHeight);

  alturaRestante -= pdfHeight;

  while (alturaRestante > 0) {
    posicaoY = alturaRestante - imgHeight + 5;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      5,
      posicaoY,
      imgWidth,
      imgHeight
    );

    alturaRestante -= pdfHeight;
  }

  pdf.save("fachada-industrial.pdf");
}

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const larguraPdf = 297;
    const alturaPdf =
      (canvas.height * larguraPdf) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      larguraPdf,
      alturaPdf
    );

    pdf.save("fachada-cad-industrial.pdf");
  }

  function renderImagem(item) {
    if (item?.imagem) {
      return (
        <img
          src={item.imagem}
          alt=""
          style={{
            width: 45,
            height: 45,
            objectFit: "contain",
          }}
        />
      );
    }

    return <div style={imgFake}>IMG</div>;
  }

  function renderTabelaAluminio(lista) {
    return (
      <table style={tabela}>
        <thead>
          <tr style={thead}>
            <th>Imagem</th>
            <th>Módulo</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>L x A</th>
            <th>Fórmula</th>
            <th>Qtd Peças</th>
            <th>Metro Un.</th>
            <th>Metro Total</th>
            <th>Barras 6m</th>
            <th>Perda</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((m, i) => (
            <tr key={i}>
              <td>{renderImagem(m)}</td>
              <td>{m.modulo}</td>
              <td>{m.codigo}</td>
              <td>{m.descricao}</td>
              <td>
                {m.largura} x {m.altura}
              </td>
              <td>{m.formula}</td>
              <td>{m.qtdPecas}</td>
              <td>{m.metrosUnit.toFixed(2)} m</td>
              <td>{m.metros.toFixed(2)} m</td>
              <td>{m.barras}</td>
              <td>{m.perda.toFixed(2)} m</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderTabelaVidros(lista) {
    return (
      <table style={tabela}>
        <thead>
          <tr style={thead}>
            <th>Imagem</th>
            <th>Módulo</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>L x A</th>
            <th>Fórmula</th>
            <th>Qtd Peças</th>
            <th>Área Un.</th>
            <th>M² Total</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((m, i) => (
            <tr key={i}>
              <td>{renderImagem(m)}</td>
              <td>{m.modulo}</td>
              <td>{m.codigo}</td>
              <td>{m.descricao}</td>
              <td>
                {m.largura} x {m.altura}
              </td>
              <td>{m.formula}</td>
              <td>{m.qtdPecas}</td>
              <td>{m.areaUn.toFixed(2)} m²</td>
              <td>{m.m2.toFixed(2)} m²</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderTabelaAcessorios(lista) {
    return (
      <table style={tabela}>
        <thead>
          <tr style={thead}>
            <th>Imagem</th>
            <th>Módulo</th>
            <th>Código</th>
            <th>Descrição</th>
            <th>L x A</th>
            <th>Fórmula</th>
            <th>Multiplicador</th>
            <th>Qtd Total</th>
            <th>Un.</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((m, i) => (
            <tr key={i}>
              <td>{renderImagem(m)}</td>
              <td>{m.modulo}</td>
              <td>{m.codigo}</td>
              <td>{m.descricao}</td>
              <td>
                {m.largura} x {m.altura}
              </td>
              <td>{m.formula}</td>
              <td>{m.qtdPecas}</td>
              <td>{m.qtd.toFixed(2)}</td>
              <td>{m.unidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
 
  return (
    <div style={page}>
      <h1 style={titulo}>Fachada CAD Industrial</h1>

      <div style={painel}>
        <label style={label}>Largura total</label>

        <input
          style={input}
          type="number"
          value={largura}
          onChange={(e) =>
            setLargura(Number(e.target.value))
          }
        />

        <label style={label}>Altura total</label>

        <input
          style={input}
          type="number"
          value={altura}
          onChange={(e) =>
            setAltura(Number(e.target.value))
          }
        />

        <label style={label}>Colunas</label>

        <input
          style={input}
          type="number"
          min="1"
          value={colunas}
          onChange={(e) => {
            const qtd = Math.max(
              1,
              Number(e.target.value || 1)
            );

            setColunas(qtd);
            atualizarGrade(qtd, linhas);
          }}
        />

        <label style={label}>Linhas</label>

        <input
          style={input}
          type="number"
          min="1"
          value={linhas}
          onChange={(e) => {
            const qtd = Math.max(
              1,
              Number(e.target.value || 1)
            );

            setLinhas(qtd);
            atualizarGrade(colunas, qtd);
          }}
        />
      </div>

      <div style={formulaBox}>
        <div>
          <label style={label}>
            Fórmula Alumínio
          </label>

          <input
            style={input}
            value={formulaAluminio}
            onChange={(e) =>
              setFormulaAluminio(e.target.value)
            }
          />
        </div>

        <div>
          <label style={label}>Fórmula Vidro</label>

          <input
            style={input}
            value={formulaVidro}
            onChange={(e) =>
              setFormulaVidro(e.target.value)
            }
          />
        </div>

        <div>
          <label style={label}>
            Fórmula Acessório
          </label>

          <input
            style={input}
            value={formulaAcessorio}
            onChange={(e) =>
              setFormulaAcessorio(e.target.value)
            }
          />
        </div>
      </div>

      <div style={helpFormula}>
        Use nas fórmulas: <b>L</b> = largura do
        módulo em mm, <b>A</b> = altura do módulo
        em mm, <b>Q</b> = quantidade.
        Exemplos: alumínio{" "}
        <b>{"((L + A) * 2) / 1000"}</b>, vidro{" "}
        <b>{"(L * A) / 1000000"}</b>, acessório{" "}
        <b>2</b>.
      </div>

      <div style={checks}>
        <label>
          <input
            type="checkbox"
            checked={mostrarMedidas}
            onChange={(e) =>
              setMostrarMedidas(e.target.checked)
            }
          />{" "}
          Mostrar medidas dentro do módulo
        </label>

        <label>
          <input
            type="checkbox"
            checked={mostrarMateriaisModulo}
            onChange={(e) =>
              setMostrarMateriaisModulo(
                e.target.checked
              )
            }
          />{" "}
          Mostrar materiais dentro do módulo
        </label>
      </div>

      <div style={botoes}>
        <button style={btn} onClick={selecionarTodos}>
          Selecionar tudo
        </button>

        <button style={btn} onClick={limparSelecao}>
          Limpar seleção
        </button>

        <button
          style={btn}
          onClick={() => aplicarTipo("FIXO")}
        >
          Fixo
        </button>

        <button
          style={btn}
          onClick={() => aplicarTipo("MAXIM-AR")}
        >
          Maxim-ar
        </button>

        <button
          style={btn}
          onClick={() => aplicarTipo("PORTA")}
        >
          Porta
        </button>

        <button
          style={btn}
          onClick={() => aplicarTipo("VAZIO")}
        >
          Vazio
        </button>

        <button
          style={btn}
          onClick={aplicarFormulasSelecionadas}
        >
          Aplicar fórmulas
        </button>

        <button
          style={btnRed}
          onClick={limparMateriais}
        >
          Limpar materiais
        </button>

        <button style={btnRed} onClick={gerarPDF}>
          Desenho em PDF
        </button>
      </div>
      <div style={abas}>
        {[
          "DESENHO",
          "PERFIS",
          "ACESSÓRIOS",
          "VIDROS",
          "MATERIAIS",
          "CORTE",
        ].map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            style={aba === a ? abaAtiva : abaBtn}
          >
            {a}
          </button>
        ))}
      </div>

      {aba === "DESENHO" && (
        <div ref={pranchaRef} style={prancha}>
          <div style={cabecalhoPrancha}>
            <div>
              <h2>Prancha Técnica de Fachada</h2>

              <p>
                Largura: <b>{larguraTotal} mm</b> |
                Altura: <b>{alturaTotal} mm</b> |
                Módulos: <b>{colunas * linhas}</b>
              </p>
            </div>

            <div style={selo}>R&A VIDROS</div>
          </div>

          <div style={cotasTopo}>
            {cotasX.map((c, i) => (
              <input
                key={i}
                value={c}
                type="number"
                onChange={(e) =>
                  alterarCotaX(i, e.target.value)
                }
                style={inputCota}
              />
            ))}
          </div>

          <div style={areaDesenhoComCotas}>
            <div style={cotasLateral}>
              {cotasY.map((c, i) => (
                <input
                  key={i}
                  value={c}
                  type="number"
                  onChange={(e) =>
                    alterarCotaY(i, e.target.value)
                  }
                  style={inputCotaY}
                />
              ))}
            </div>

            <div
              style={{
                ...desenho,
                gridTemplateColumns: cotasX
                  .map((c) => `${Number(c || 1)}fr`)
                  .join(" "),
                gridTemplateRows: cotasY
                  .map((c) => `${Number(c || 1)}fr`)
                  .join(" "),
              }}
            >
              {Object.values(grade).map((m, i) => {
                const ativo = selecionados.includes(m.id);

                const L = Number(cotasX[m.coluna] || 0);
                const A = Number(cotasY[m.linha] || 0);

                return (
                  <div
                    key={m.id}
                    onClick={() => selecionarModulo(m.id)}
                    style={{
                      ...modulo,
                      background:
                        m.tipo === "VAZIO"
                          ? "#f8fafc"
                          : ativo
                          ? "#dbeafe"
                          : "#eef6f5",
                      border: ativo
                        ? "3px solid #2563eb"
                        : "2px solid #334155",
                    }}
                  >
                    <strong>{m.tipo}</strong>

                    {mostrarMedidas && (
                      <span>
                        {L} x {A} mm
                      </span>
                    )}

                    {mostrarMateriaisModulo && (
                      <small>
                        {m.perfil?.codigo || "Sem perfil"}
                        <br />
                        {m.vidro?.nome || "Sem vidro"}
                        <br />
                        {m.acessorio?.codigo ||
                          "Sem acessório"}
                      </small>
                    )}

                    <em>Módulo {i + 1}</em>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {aba === "PERFIS" && (
        <div style={box}>
          <h2>Selecionar Perfil de Alumínio</h2>

          <p>
            Selecione um ou mais módulos no desenho e
            clique no perfil desejado.
          </p>

          {perfis.map((p) => (
            <button
              key={p.id}
              style={cardMaterial}
              onClick={() =>
                aplicarMaterial("perfil", p)
              }
            >
              {renderImagem(p)}

              <div>
                <b>{p.codigo}</b>
                <br />
                {p.nome}
              </div>
            </button>
          ))}
        </div>
      )}

      {aba === "VIDROS" && (
        <div style={box}>
          <h2>Selecionar Vidro</h2>

          <p>
            Selecione um ou mais módulos no desenho e
            clique no vidro desejado.
          </p>

          {vidros.map((v) => (
            <button
              key={v.id}
              style={cardMaterial}
              onClick={() =>
                aplicarMaterial("vidro", v)
              }
            >
              {renderImagem(v)}

              <div>
                <b>{v.codigo}</b>
                <br />
                {v.nome}
              </div>
            </button>
          ))}
        </div>
      )}

      {aba === "ACESSÓRIOS" && (
        <div style={box}>
          <h2>Selecionar Acessório</h2>

          <p>
            Selecione um ou mais módulos no desenho e
            clique no acessório desejado.
          </p>

          {acessorios.map((a) => (
            <button
              key={a.id}
              style={cardMaterial}
              onClick={() =>
                aplicarMaterial("acessorio", a)
              }
            >
              {renderImagem(a)}

              <div>
                <b>{a.codigo}</b>
                <br />
                {a.nome}
              </div>
            </button>
          ))}
        </div>
      )}
      {aba === "MATERIAIS" && (
        <div style={box}>
          <h2>Relatório Industrial de Materiais</h2>

          <div style={cardsResumo}>
            <div style={cardResumo}>
              <b>{resumo.barras}</b>
              <span>Barras alumínio 6m</span>
            </div>

            <div style={cardResumo}>
              <b>{resumo.metros.toFixed(2)} m</b>
              <span>Metros alumínio</span>
            </div>

            <div style={cardResumo}>
              <b>{resumo.perda.toFixed(2)} m</b>
              <span>Perda alumínio</span>
            </div>

            <div style={cardResumo}>
              <b>{resumo.pecasVidro}</b>
              <span>Peças de vidro</span>
            </div>

            <div style={cardResumo}>
              <b>{resumo.m2.toFixed(2)} m²</b>
              <span>Total vidro</span>
            </div>

            <div style={cardResumo}>
              <b>{resumo.acessorios.toFixed(2)}</b>
              <span>Acessórios</span>
            </div>
          </div>

          <div style={subAbas}>
            {[
              "GERAL",
              "ALUMÍNIO",
              "VIDROS",
              "ACESSÓRIOS",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setSubAbaMateriais(s)}
                style={
                  subAbaMateriais === s
                    ? abaAtiva
                    : abaBtn
                }
              >
                {s}
              </button>
            ))}
          </div>

          {subAbaMateriais === "GERAL" && (
            <div>
              <h3>Alumínio</h3>
              {renderTabelaAluminio(materiais.aluminio)}

              <h3>Vidros</h3>
              {renderTabelaVidros(materiais.vidros)}

              <h3>Acessórios</h3>
              {renderTabelaAcessorios(
                materiais.acessorios
              )}
            </div>
          )}

          {subAbaMateriais === "ALUMÍNIO" &&
            renderTabelaAluminio(materiais.aluminio)}

          {subAbaMateriais === "VIDROS" &&
            renderTabelaVidros(materiais.vidros)}

          {subAbaMateriais === "ACESSÓRIOS" &&
            renderTabelaAcessorios(
              materiais.acessorios
            )}
        </div>
      )}

      {aba === "CORTE" && (
        <div style={box}>
          <h2>Plano de Corte Industrial</h2>

          <p>
            Plano básico por barras de 6 metros.
            A otimização avançada pode ser integrada
            depois com perda de serra e combinação de peças.
          </p>

          {renderTabelaAluminio(materiais.aluminio)}
        </div>
      )}
    </div>
  );
}

const page = {
  padding: 30,
  background: "#eef2f7",
  minHeight: "100vh",
};

const titulo = {
  fontSize: 34,
  marginBottom: 20,
  color: "#0f172a",
};

const painel = {
  display: "grid",
  gridTemplateColumns:
    "110px 1fr 110px 1fr 90px 1fr 80px 1fr",
  gap: 10,
  alignItems: "center",
  marginBottom: 15,
};

const formulaBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 15,
  marginBottom: 10,
};

const label = {
  fontWeight: "bold",
  color: "#334155",
};

const input = {
  width: "100%",
  padding: 13,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 15,
  boxSizing: "border-box",
};

const helpFormula = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  padding: 14,
  borderRadius: 12,
  marginBottom: 15,
  color: "#7c2d12",
};

const checks = {
  display: "flex",
  gap: 25,
  marginBottom: 20,
  fontSize: 15,
};

const botoes = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 20,
};

const btn = {
  padding: "13px 18px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnRed = {
  ...btn,
  background: "#b91c1c",
};

const abas = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const subAbas = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const abaBtn = {
  padding: "14px 22px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const abaAtiva = {
  ...abaBtn,
  background: "#0f172a",
  color: "white",
};

const prancha = {
  background: "white",
  padding: 18,
  borderRadius: 18,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  overflow: "hidden",
  maxWidth: 900,
  margin: "0 auto",
};

const cabecalhoPrancha = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
};

const selo = {
  background: "#0f172a",
  color: "white",
  padding: "12px 18px",
  borderRadius: 10,
  fontWeight: "bold",
};

const cotasTopo = {
  marginLeft: 90,
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "1fr",
  gap: 6,
  marginBottom: 8,
};

const areaDesenhoComCotas = {
  display: "flex",
  gap: 8,
  alignItems: "stretch",
};

const cotasLateral = {
  width: 80,
  display: "grid",
  gap: 6,
};

const inputCota = {
  width: "100%",
  padding: 9,
  borderRadius: 8,
  border: "1px solid #94a3b8",
  textAlign: "center",
  fontWeight: "bold",
  boxSizing: "border-box",
  background: "#f8fafc",
};

const inputCotaY = {
  ...inputCota,
  minHeight: 55,
};

const desenho = {
  display: "grid",
  width: "100%",
  height: "auto",
  minHeight: 0,
  aspectRatio: "1 / 1.35",
  border: "4px solid #0f172a",
  background: "#dbeafe",
  overflow: "hidden",
};

const modulo = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  cursor: "pointer",
  fontSize: 10,
  textAlign: "center",
 padding: 3,
  boxSizing: "border-box",
};

const box = {
  background: "white",
  padding: 25,
  borderRadius: 18,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const cardMaterial = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  width: "100%",
  padding: 15,
  marginBottom: 10,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer",
  textAlign: "left",
};

const cardsResumo = {
  display: "grid",
  gridTemplateColumns:
    "repeat(6, minmax(150px, 1fr))",
  gap: 12,
  marginBottom: 20,
};

const cardResumo = {
  background: "#0f172a",
  color: "white",
  padding: 18,
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  fontSize: 13,
  marginBottom: 25,
};

const thead = {
  background: "#dfe7e5",
};

const imgFake = {
  width: 45,
  height: 45,
  border: "1px solid #999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 10,
  color: "#555",
  background: "#f8fafc",
};