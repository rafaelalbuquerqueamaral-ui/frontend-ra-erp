import React, { useEffect, useState } from "react";

const API = "https://backend-esquadrias.onrender.com";

const TIPOS = ["FIXO", "MAXIMAR", "PORTA", "CORRER", "VAZIO"];

function gerarGrade(colunas, linhas) {
  return Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => ({
      tipo: "FIXO",
      largura: 1000,
      altura: 1000,
    }))
  );
}

export default function FachadaCADPro() {
  const [nome, setNome] = useState("Fachada técnica");
  const [obra, setObra] = useState("");
  const [colunas, setColunas] = useState(3);
  const [linhas, setLinhas] = useState(2);
  const [grade, setGrade] = useState(gerarGrade(3, 2));
  const [fachadas, setFachadas] = useState([]);

  useEffect(() => {
    carregarFachadas();
  }, []);

  async function carregarFachadas() {
    try {
      const res = await fetch(`${API}/fachadas`);
      const data = await res.json();
      setFachadas(Array.isArray(data) ? data : []);
    } catch {
      setFachadas([]);
    }
  }

  function criarNovaGrade() {
    setGrade(gerarGrade(Number(colunas), Number(linhas)));
  }

  function alterarModulo(y, x, campo, valor) {
    const nova = grade.map((linha) => linha.map((m) => ({ ...m })));
    nova[y][x][campo] = valor;
    setGrade(nova);
  }

  function larguraTotal() {
    if (!grade[0]) return 0;
    return grade[0].reduce((s, m) => s + Number(m.largura || 0), 0);
  }

  function alturaTotal() {
    return grade.reduce((s, linha) => s + Number(linha[0]?.altura || 0), 0);
  }

  async function salvarFachada() {
    try {
      await fetch(`${API}/fachadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          obra,
          colunas,
          linhas,
          largura: larguraTotal(),
          altura: alturaTotal(),
          desenho_json: grade,
        }),
      });

      alert("Fachada salva!");
      carregarFachadas();
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar fachada.");
    }
  }

  function gerarPDF() {
    window.print();
  }

  return (
    <div style={page}>
      <style>{cssPrint}</style>

      <div className="no-print">
        <h1>Fachada CAD PRO</h1>

        <div style={card}>
          <h2>Configuração da Fachada</h2>

          <div style={gridTop}>
            <input style={input} placeholder="Nome da fachada" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input style={input} placeholder="Obra / Cliente" value={obra} onChange={(e) => setObra(e.target.value)} />
            <input style={input} type="number" placeholder="Colunas" value={colunas} onChange={(e) => setColunas(e.target.value)} />
            <input style={input} type="number" placeholder="Linhas" value={linhas} onChange={(e) => setLinhas(e.target.value)} />
          </div>

          <button style={btnDark} onClick={criarNovaGrade}>Gerar Fachada</button>
          <button style={btnBlue} onClick={salvarFachada}>Salvar Fachada</button>
          <button style={btnGreen} onClick={gerarPDF}>Gerar Prancha PDF Limpa</button>
        </div>

        <div style={card}>
          <h2>Editor Técnico</h2>

          <div style={fachada}>
            {grade.map((linha, y) => (
              <div key={y} style={linhaStyle}>
                {linha.map((modulo, x) => (
                  <div key={x} style={moduloStyle}>
                    <select style={inputMini} value={modulo.tipo} onChange={(e) => alterarModulo(y, x, "tipo", e.target.value)}>
                      {TIPOS.map((t) => <option key={t}>{t}</option>)}
                    </select>

                    <input style={inputMini} type="number" value={modulo.largura} onChange={(e) => alterarModulo(y, x, "largura", Number(e.target.value))} />
                    <input style={inputMini} type="number" value={modulo.altura} onChange={(e) => alterarModulo(y, x, "altura", Number(e.target.value))} />

                    <div style={tipoLabel}>{modulo.tipo}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h2>Fachadas Salvas</h2>
          {fachadas.map((f) => (
            <div key={f.id} style={itemLista}>
              <b>{f.nome}</b> — {f.obra || "Sem obra"}
            </div>
          ))}
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
              <p><b>Fachada:</b> {nome}</p>
              <p><b>Obra:</b> {obra || "Não informada"}</p>
              <p><b>Data:</b> {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div className="medida-topo">{larguraTotal()} mm</div>

          <div className="area-desenho">
            <div className="medida-lateral">{alturaTotal()} mm</div>

            <div className="desenho-print">
              {grade.map((linha, y) => (
                <div className="linha-print" key={y}>
                  {linha.map((modulo, x) => (
                    <div className="modulo-print" key={x}>
                      <div className="cota-superior">{modulo.largura} mm</div>
                      <div className="tipo-print">{modulo.tipo}</div>
                      <div className="cota-interna">{modulo.altura} mm</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="resumo-tecnico">
            <h2>Memória Técnica</h2>
            <p><b>Quantidade de colunas:</b> {colunas}</p>
            <p><b>Quantidade de linhas:</b> {linhas}</p>
            <p><b>Largura total:</b> {larguraTotal()} mm</p>
            <p><b>Altura total:</b> {alturaTotal()} mm</p>
            <p><b>Observação:</b> Prancha gerada para conferência técnica, fabricação e instalação.</p>
          </div>

          <div className="rodape">
            Documento técnico sem valores comerciais.
          </div>
        </div>
      </div>
    </div>
  );
}

const cssPrint = `
.print-only {
  display: none;
}

@media print {
  body {
    background: white !important;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  .prancha {
    padding: 28px;
    background: white;
    color: black;
    font-family: Arial, sans-serif;
  }

  .cabecalho {
    display: flex;
    justify-content: space-between;
    border: 2px solid #000;
    padding: 14px;
    margin-bottom: 20px;
  }

  .cabecalho h1 {
    margin: 0;
    font-size: 22px;
  }

  .cabecalho p {
    margin: 4px 0;
    font-size: 12px;
  }

  .dados {
    text-align: right;
    font-size: 12px;
  }

  .medida-topo {
    text-align: center;
    font-weight: bold;
    border-top: 2px solid #000;
    margin: 0 60px 8px 60px;
    padding-top: 5px;
  }

  .area-desenho {
    display: flex;
    align-items: center;
  }

  .medida-lateral {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-weight: bold;
    border-left: 2px solid #000;
    padding-left: 6px;
    margin-right: 10px;
  }

  .desenho-print {
    width: 100%;
    border: 3px solid #000;
  }

  .linha-print {
    display: flex;
  }

  .modulo-print {
    flex: 1;
    min-height: 120px;
    border: 1.8px solid #000;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tipo-print {
    font-size: 18px;
    font-weight: bold;
  }

  .cota-superior {
    position: absolute;
    top: 5px;
    font-size: 10px;
  }

  .cota-interna {
    position: absolute;
    bottom: 5px;
    font-size: 10px;
  }

  .resumo-tecnico {
    margin-top: 22px;
    border: 2px solid #000;
    padding: 14px;
    font-size: 12px;
  }

  .resumo-tecnico h2 {
    margin-top: 0;
    font-size: 16px;
  }

  .rodape {
    margin-top: 18px;
    font-size: 11px;
    text-align: center;
    border-top: 1px solid #000;
    padding-top: 8px;
  }
}
`;

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
};

const gridTop = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
};

const input = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btnDark = {
  marginTop: 16,
  padding: "14px 22px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnBlue = {
  ...btnDark,
  marginLeft: 10,
  background: "#2563eb",
};

const btnGreen = {
  ...btnDark,
  marginLeft: 10,
  background: "#16a34a",
};

const fachada = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const linhaStyle = {
  display: "flex",
  gap: 10,
};

const moduloStyle = {
  width: 170,
  minHeight: 170,
  border: "2px solid #cbd5e1",
  borderRadius: 14,
  background: "#f8fafc",
  padding: 10,
};

const inputMini = {
  width: "100%",
  marginBottom: 8,
  padding: 8,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const tipoLabel = {
  marginTop: 8,
  textAlign: "center",
  fontWeight: "bold",
};

const itemLista = {
  background: "#f8fafc",
  borderRadius: 12,
  padding: 12,
  marginBottom: 8,
};