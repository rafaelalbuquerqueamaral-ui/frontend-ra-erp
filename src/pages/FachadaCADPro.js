import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";
// ONLINE:
// const API = "https://backend-esquadrias.onrender.com";

const TIPOS = {
  FIXO: "FIXO",
  MAXIMAR: "MAXIMAR",
  PORTA: "PORTA",
  CORRER: "CORRER",
  VAZIO: "VAZIO",
};

function gerarGrade(colunas, linhas) {
  const grade = [];

  for (let y = 0; y < linhas; y++) {
    const linha = [];

    for (let x = 0; x < colunas; x++) {
      linha.push({
        tipo: TIPOS.FIXO,
        largura: 1000,
        altura: 1000,
      });
    }

    grade.push(linha);
  }

  return grade;
}

export default function FachadaCADPro() {
  const [nome, setNome] = useState("");
  const [obra, setObra] = useState("");
  const [colunas, setColunas] = useState(3);
  const [linhas, setLinhas] = useState(2);

  const [grade, setGrade] = useState(
    gerarGrade(3, 2)
  );

  const [fachadas, setFachadas] = useState([]);

  useEffect(() => {
    carregarFachadas();
  }, []);

  async function carregarFachadas() {
    try {
      const res = await fetch(`${API}/fachadas`);
      const data = await res.json();

      setFachadas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setFachadas([]);
    }
  }

  function criarNovaGrade() {
    setGrade(
      gerarGrade(
        Number(colunas),
        Number(linhas)
      )
    );
  }

  function alterarModulo(y, x, campo, valor) {
    const nova = [...grade];

    nova[y][x][campo] = valor;

    setGrade(nova);
  }

  function calcularAreaTotal() {
    let total = 0;

    grade.forEach((linha) => {
      linha.forEach((modulo) => {
        const area =
          (modulo.largura / 1000) *
          (modulo.altura / 1000);

        total += area;
      });
    });

    return total.toFixed(2);
  }

  function calcularVidro() {
    return (calcularAreaTotal() * 220).toFixed(2);
  }

  function calcularAluminio() {
    return (calcularAreaTotal() * 180).toFixed(2);
  }

  function calcularTotal() {
    return (
      Number(calcularVidro()) +
      Number(calcularAluminio())
    ).toFixed(2);
  }

  async function salvarFachada() {
    try {
      const res = await fetch(`${API}/fachadas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nome,
          obra,
          colunas,
          linhas,
          desenho_json: grade,
        }),
      });

      if (!res.ok) {
        alert("Erro ao salvar fachada");
        return;
      }

      alert("Fachada salva!");

      carregarFachadas();
    } catch (error) {
      console.log(error);
    }
  }

  async function enviarParaProducao() {
    try {
      alert("Fachada enviada para produção!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={page}>
      <h1>Fachada CAD PRO</h1>

      <div style={card}>
        <div style={gridTop}>
          <input
            style={input}
            placeholder="Nome da fachada"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <input
            style={input}
            placeholder="Obra"
            value={obra}
            onChange={(e) =>
              setObra(e.target.value)
            }
          />

          <input
            style={input}
            type="number"
            placeholder="Colunas"
            value={colunas}
            onChange={(e) =>
              setColunas(e.target.value)
            }
          />

          <input
            style={input}
            type="number"
            placeholder="Linhas"
            value={linhas}
            onChange={(e) =>
              setLinhas(e.target.value)
            }
          />
        </div>

        <button
          style={btnDark}
          onClick={criarNovaGrade}
        >
          Gerar Fachada
        </button>
      </div>

      <div style={card}>
        <h2>Desenho Técnico</h2>

        <div style={fachada}>
          {grade.map((linha, y) => (
            <div key={y} style={linhaStyle}>
              {linha.map((modulo, x) => (
                <div
                  key={x}
                  style={moduloStyle}
                >
                  <select
                    style={inputMini}
                    value={modulo.tipo}
                    onChange={(e) =>
                      alterarModulo(
                        y,
                        x,
                        "tipo",
                        e.target.value
                      )
                    }
                  >
                    <option value="FIXO">
                      FIXO
                    </option>

                    <option value="MAXIMAR">
                      MAXIMAR
                    </option>

                    <option value="PORTA">
                      PORTA
                    </option>

                    <option value="CORRER">
                      CORRER
                    </option>

                    <option value="VAZIO">
                      VAZIO
                    </option>
                  </select>

                  <input
                    style={inputMini}
                    type="number"
                    value={modulo.largura}
                    onChange={(e) =>
                      alterarModulo(
                        y,
                        x,
                        "largura",
                        Number(e.target.value)
                      )
                    }
                  />

                  <input
                    style={inputMini}
                    type="number"
                    value={modulo.altura}
                    onChange={(e) =>
                      alterarModulo(
                        y,
                        x,
                        "altura",
                        Number(e.target.value)
                      )
                    }
                  />

                  <div style={tipoLabel}>
                    {modulo.tipo}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <h2>Resumo Técnico</h2>

        <div style={cardsResumo}>
          <div style={miniCard}>
            <h3>Área Total</h3>
            <p>{calcularAreaTotal()} m²</p>
          </div>

          <div style={miniCard}>
            <h3>Vidro</h3>
            <p>
              R$ {calcularVidro()}
            </p>
          </div>

          <div style={miniCard}>
            <h3>Alumínio</h3>
            <p>
              R$ {calcularAluminio()}
            </p>
          </div>

          <div style={miniCard}>
            <h3>Total</h3>
            <p>
              R$ {calcularTotal()}
            </p>
          </div>
        </div>

        <div style={botoes}>
          <button
            style={btnDark}
            onClick={salvarFachada}
          >
            Salvar Fachada
          </button>

          <button
            style={btnBlue}
            onClick={enviarParaProducao}
          >
            Enviar para Produção
          </button>
        </div>
      </div>

      <div style={card}>
        <h2>Fachadas Salvas</h2>

        <div style={lista}>
          {fachadas.map((f) => (
            <div
              key={f.id}
              style={itemLista}
            >
              <h3>{f.nome}</h3>

              <p>
                <b>Obra:</b> {f.obra}
              </p>

              <p>
                <b>ID:</b> {f.id}
              </p>
            </div>
          ))}
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
  boxShadow:
    "0 10px 30px rgba(15,23,42,0.08)",
};

const gridTop = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
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
  marginTop: 16,
  marginLeft: 10,
  padding: "14px 22px",
  border: "none",
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
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
  width: 180,
  minHeight: 180,
  border:
    "2px solid #cbd5e1",
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

const cardsResumo = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: 16,
};

const miniCard = {
  background: "#f8fafc",
  borderRadius: 14,
  padding: 20,
};

const botoes = {
  marginTop: 20,
};

const lista = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: 16,
};

const itemLista = {
  background: "#f8fafc",
  borderRadius: 14,
  padding: 18,
};