import React, { useEffect, useState } from "react";
import api from "../services/api";

const TIPOS = ["FIXO", "MAXIMAR", "PORTA", "CORRER", "VAZIO"];

function gerarGrade(colunas, linhas) {
  return Array.from({ length: Number(linhas) }, () =>
    Array.from({ length: Number(colunas) }, () => ({
      tipo: "FIXO",
      largura: 1000,
      altura: 2200,
      perfil: "",
      vidro: "",
      acessorio: "",
      observacao: "",
    }))
  );
}

export default function FachadaCADPro() {
  const [nome, setNome] = useState("Fachada Principal");
  const [obra, setObra] = useState("");
  const [colunas, setColunas] = useState(3);
  const [linhas, setLinhas] = useState(2);
  const [grade, setGrade] = useState(gerarGrade(3, 2));

  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios] = useState([
    { id: 1, nome: "Fecho concha" },
    { id: 2, nome: "Roldana" },
    { id: 3, nome: "Escova de vedação" },
    { id: 4, nome: "Parafusos" },
    { id: 5, nome: "Silicone" },
  ]);

  useEffect(() => {
    carregarBases();
  }, []);

  async function carregarBases() {
    try {
      const [resPerfis, resVidros] = await Promise.all([
        api.get("/perfis"),
        api.get("/vidros"),
      ]);

      setPerfis(Array.isArray(resPerfis.data) ? resPerfis.data : []);
      setVidros(Array.isArray(resVidros.data) ? resVidros.data : []);
    } catch (error) {
      console.log(error);
    }
  }

  function gerarNovaFachada() {
    setGrade(gerarGrade(colunas, linhas));
  }

  function alterarModulo(y, x, campo, valor) {
    const nova = grade.map((linha) => linha.map((m) => ({ ...m })));
    nova[y][x][campo] = valor;
    setGrade(nova);
  }

  function larguraTotal() {
    if (!grade[0]) return 0;
    return grade[0].reduce((soma, m) => soma + Number(m.largura || 0), 0);
  }

  function alturaTotal() {
    return grade.reduce((soma, linha) => soma + Number(linha[0]?.altura || 0), 0);
  }

  function areaTotal() {
    let total = 0;

    grade.forEach((linha) => {
      linha.forEach((m) => {
        if (m.tipo !== "VAZIO") {
          total += (Number(m.largura || 0) * Number(m.altura || 0)) / 1000000;
        }
      });
    });

    return total;
  }

  function gerarMateriais() {
    const lista = [];

    grade.forEach((linha, y) => {
      linha.forEach((m, x) => {
        if (m.tipo === "VAZIO") return;

        const perimetro =
          (Number(m.largura || 0) * 2 + Number(m.altura || 0) * 2) / 1000;

        const area =
          (Number(m.largura || 0) * Number(m.altura || 0)) / 1000000;

        lista.push({
          modulo: `${y + 1}.${x + 1}`,
          tipo: m.tipo,
          perfil: m.perfil || "Não definido",
          vidro: m.vidro || "Não definido",
          acessorio: m.acessorio || "Não definido",
          largura: m.largura,
          altura: m.altura,
          area: area.toFixed(2),
          perimetro: perimetro.toFixed(2),
        });
      });
    });

    return lista;
  }

  async function salvarFachada() {
    try {
      await api.post("/fachadas", {
        nome,
        obra,
        colunas,
        linhas,
        largura: larguraTotal(),
        altura: alturaTotal(),
        desenho_json: {
          grade,
          materiais: gerarMateriais(),
        },
      });

      alert("Fachada salva com materiais!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar fachada.");
    }
  }

  function gerarPDF() {
    window.print();
  }

  const materiais = gerarMateriais();

  return (
    <div style={page}>
      <style>{cssPrint}</style>

      <div className="no-print">
        <h1>Fachada CAD PRO</h1>

        <div style={card}>
          <h2>Configuração</h2>

          <div style={gridTop}>
            <input
              style={input}
              placeholder="Nome da fachada"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              style={input}
              placeholder="Obra / Cliente"
              value={obra}
              onChange={(e) => setObra(e.target.value)}
            />

            <input
              style={input}
              type="number"
              placeholder="Colunas"
              value={colunas}
              onChange={(e) => setColunas(e.target.value)}
            />

            <input
              style={input}
              type="number"
              placeholder="Linhas"
              value={linhas}
              onChange={(e) => setLinhas(e.target.value)}
            />
          </div>

          <button style={btnDark} onClick={gerarNovaFachada}>
            Gerar Fachada
          </button>

          <button style={btnBlue} onClick={salvarFachada}>
            Salvar Fachada
          </button>

          <button style={btnGreen} onClick={gerarPDF}>
            Gerar PDF Técnico
          </button>
        </div>

        <div style={card}>
          <h2>Editor Técnico com Materiais</h2>

          <div style={editorGrid}>
            {grade.map((linha, y) =>
              linha.map((m, x) => (
                <div key={`${y}-${x}`} style={moduloEditor}>
                  <strong>Módulo {y + 1}.{x + 1}</strong>

                  <select
                    style={inputMini}
                    value={m.tipo}
                    onChange={(e) => alterarModulo(y, x, "tipo", e.target.value)}
                  >
                    {TIPOS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <input
                    style={inputMini}
                    type="number"
                    placeholder="Largura mm"
                    value={m.largura}
                    onChange={(e) =>
                      alterarModulo(y, x, "largura", Number(e.target.value))
                    }
                  />

                  <input
                    style={inputMini}
                    type="number"
                    placeholder="Altura mm"
                    value={m.altura}
                    onChange={(e) =>
                      alterarModulo(y, x, "altura", Number(e.target.value))
                    }
                  />

                  <select
                    style={inputMini}
                    value={m.perfil}
                    onChange={(e) => alterarModulo(y, x, "perfil", e.target.value)}
                  >
                    <option value="">Selecionar perfil</option>
                    {perfis.map((p) => (
                      <option key={p.id} value={p.nome || p.descricao || p.codigo}>
                        {p.codigo} - {p.nome || p.descricao}
                      </option>
                    ))}
                  </select>

                  <select
                    style={inputMini}
                    value={m.vidro}
                    onChange={(e) => alterarModulo(y, x, "vidro", e.target.value)}
                  >
                    <option value="">Selecionar vidro</option>
                    {vidros.map((v) => (
                      <option key={v.id} value={v.nome}>
                        {v.nome} {v.espessura ? `- ${v.espessura}` : ""}
                      </option>
                    ))}
                  </select>

                  <select
                    style={inputMini}
                    value={m.acessorio}
                    onChange={(e) =>
                      alterarModulo(y, x, "acessorio", e.target.value)
                    }
                  >
                    <option value="">Selecionar acessório</option>
                    {acessorios.map((a) => (
                      <option key={a.id} value={a.nome}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={card}>
          <h2>Prancha Visual na Tela</h2>

          <div style={cotasTopo}>
            {grade[0]?.map((m, i) => (
              <div key={i} style={cotaTopo}>
                {m.largura} mm
              </div>
            ))}
          </div>

          <div style={areaPreview}>
            <div style={cotasLaterais}>
              {grade.map((linha, i) => (
                <div key={i} style={cotaLateral}>
                  {linha[0]?.altura} mm
                </div>
              ))}
            </div>

            <div style={gradeDesenho}>
              {grade.map((linha, y) => (
                <div key={y} style={linhaDesenho}>
                  {linha.map((m, x) => (
                    <div key={x} style={moduloDesenho}>
                      <div style={tipoCentro}>{m.tipo}</div>
                      <div style={medidaInterna}>
                        {m.largura} x {m.altura}
                      </div>
                      <div style={materialModulo}>
                        <small>{m.perfil || "Perfil não definido"}</small>
                        <small>{m.vidro || "Vidro não definido"}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={card}>
          <h2>Lista Automática de Materiais</h2>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Módulo</th>
                <th style={th}>Tipo</th>
                <th style={th}>Perfil</th>
                <th style={th}>Vidro</th>
                <th style={th}>Acessório</th>
                <th style={th}>Medidas</th>
                <th style={th}>Área</th>
                <th style={th}>Perímetro</th>
              </tr>
            </thead>

            <tbody>
              {materiais.map((item, i) => (
                <tr key={i}>
                  <td style={td}>{item.modulo}</td>
                  <td style={td}>{item.tipo}</td>
                  <td style={td}>{item.perfil}</td>
                  <td style={td}>{item.vidro}</td>
                  <td style={td}>{item.acessorio}</td>
                  <td style={td}>
                    {item.largura} x {item.altura}
                  </td>
                  <td style={td}>{item.area} m²</td>
                  <td style={td}>{item.perimetro} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h2>Resumo Técnico</h2>
          <p>
            <b>Largura total:</b> {larguraTotal()} mm
          </p>
          <p>
            <b>Altura total:</b> {alturaTotal()} mm
          </p>
          <p>
            <b>Área total:</b> {areaTotal().toFixed(2)} m²
          </p>
        </div>
      </div>

      <div className="print-only">
        <div className="prancha">
          <div className="cabecalho">
            <div>
              <h1>R&A VIDROS E ESQUADRIAS</h1>
              <p>PRANCHA TÉCNICA DE FACHADA</p>
            </div>

            <div className="dados">
              <p>
                <b>Fachada:</b> {nome}
              </p>
              <p>
                <b>Obra:</b> {obra || "Não informada"}
              </p>
              <p>
                <b>Data:</b> {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="linha-cota-horizontal">
            {grade[0]?.map((m, i) => (
              <div key={i} className="cota-topo-print">
                {m.largura} mm
              </div>
            ))}
          </div>

          <div className="desenho-area-print">
            <div className="coluna-cotas-print">
              {grade.map((linha, i) => (
                <div key={i} className="cota-lateral-print">
                  {linha[0]?.altura} mm
                </div>
              ))}
            </div>

            <div className="desenho-grade-print">
              {grade.map((linha, y) => (
                <div key={y} className="linha-print">
                  {linha.map((m, x) => (
                    <div key={x} className="modulo-print">
                      <div className="tipo-centro-print">{m.tipo}</div>
                      <div className="material-print">{m.perfil || ""}</div>
                      <div className="vidro-print">{m.vidro || ""}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="resumo-print">
            <h2>Resumo Técnico</h2>
            <p>
              <b>Largura total:</b> {larguraTotal()} mm
            </p>
            <p>
              <b>Altura total:</b> {alturaTotal()} mm
            </p>
            <p>
              <b>Área total:</b> {areaTotal().toFixed(2)} m²
            </p>
            <p>
              <b>Observação:</b> Documento técnico sem valores comerciais.
            </p>
          </div>

          <div className="materiais-print">
            <h2>Lista de Materiais por Módulo</h2>
            <table>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Tipo</th>
                  <th>Perfil</th>
                  <th>Vidro</th>
                  <th>Acessório</th>
                  <th>Medidas</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map((item, i) => (
                  <tr key={i}>
                    <td>{item.modulo}</td>
                    <td>{item.tipo}</td>
                    <td>{item.perfil}</td>
                    <td>{item.vidro}</td>
                    <td>{item.acessorio}</td>
                    <td>
                      {item.largura} x {item.altura}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: 30,
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  marginBottom: 24,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const gridTop = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 12,
};

const input = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btnDark = {
  marginTop: 15,
  padding: "14px 22px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  marginRight: 10,
  cursor: "pointer",
};

const btnBlue = {
  ...btnDark,
  background: "#2563eb",
};

const btnGreen = {
  ...btnDark,
  background: "#16a34a",
};

const editorGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const moduloEditor = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: 15,
};

const inputMini = {
  width: "100%",
  marginTop: 8,
  padding: 9,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const cotasTopo = {
  display: "flex",
  marginLeft: 70,
  marginBottom: 6,
};

const cotaTopo = {
  flex: 1,
  textAlign: "center",
  borderTop: "2px solid #111827",
  paddingTop: 6,
  fontWeight: "bold",
  fontSize: 12,
};

const areaPreview = {
  display: "flex",
};

const cotasLaterais = {
  width: 60,
  display: "flex",
  flexDirection: "column",
};

const cotaLateral = {
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
  borderLeft: "2px solid #111827",
  fontWeight: "bold",
  fontSize: 12,
};

const gradeDesenho = {
  flex: 1,
  border: "3px solid #111827",
  background: "#fff",
};

const linhaDesenho = {
  display: "flex",
};

const moduloDesenho = {
  flex: 1,
  height: 180,
  border: "1.5px solid #111827",
  position: "relative",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const tipoCentro = {
  fontSize: 22,
  fontWeight: "bold",
};

const medidaInterna = {
  position: "absolute",
  bottom: 8,
  fontSize: 11,
  fontWeight: "bold",
};

const materialModulo = {
  position: "absolute",
  top: 8,
  left: 8,
  right: 8,
  display: "grid",
  gap: 4,
  fontSize: 10,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  background: "#f1f5f9",
  padding: 10,
};

const td = {
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
};

const cssPrint = `
.print-only {
  display: none;
}

@media print {
  body {
    margin: 0 !important;
    background: white !important;
  }

  .no-print,
  aside,
  nav,
  button,
  input,
  select,
  textarea {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  .prancha {
    width: 100%;
    min-height: 100vh;
    padding: 25px 35px;
    background: white;
    color: #000;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }

  .cabecalho {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    border: 2px solid #000;
    margin-bottom: 25px;
  }

  .cabecalho div {
    padding: 12px;
  }

  .cabecalho h1 {
    font-size: 22px;
    margin: 0;
    letter-spacing: 1px;
  }

  .cabecalho p {
    font-size: 12px;
    margin: 5px 0;
  }

  .dados {
    border-left: 2px solid #000;
    font-size: 12px;
  }

  .linha-cota-horizontal {
    display: flex;
    margin-left: 70px;
    margin-bottom: 6px;
  }

  .cota-topo-print {
    flex: 1;
    text-align: center;
    font-size: 11px;
    font-weight: bold;
    border-top: 2px solid #000;
    padding-top: 4px;
  }

  .desenho-area-print {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .coluna-cotas-print {
    width: 60px;
    display: flex;
    flex-direction: column;
  }

  .cota-lateral-print {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 11px;
    font-weight: bold;
    border-left: 2px solid #000;
  }

  .desenho-grade-print {
    width: 720px;
    border: 3px solid #000;
  }

  .linha-print {
    display: flex;
  }

  .modulo-print {
    flex: 1;
    height: 140px;
    border: 1.5px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .tipo-centro-print {
    font-size: 17px;
    font-weight: bold;
  }

  .material-print {
    position: absolute;
    top: 6px;
    font-size: 9px;
  }

  .vidro-print {
    position: absolute;
    bottom: 6px;
    font-size: 9px;
  }

  .resumo-print {
    margin-top: 18px;
    border: 2px solid #000;
    padding: 12px;
    font-size: 11px;
  }

  .resumo-print h2,
  .materiais-print h2 {
    font-size: 15px;
    margin: 0 0 8px 0;
  }

  .materiais-print {
    margin-top: 14px;
    font-size: 10px;
  }

  .materiais-print table {
    width: 100%;
    border-collapse: collapse;
  }

  .materiais-print th,
  .materiais-print td {
    border: 1px solid #000;
    padding: 5px;
  }

  @page {
    size: A4 landscape;
    margin: 10mm;
  }
}
`;