import { useState } from "react";

export default function FachadaCADPro() {
  const [nome, setNome] = useState("Fachada Principal");

  const [colunas, setColunas] = useState([
    1200, 1200, 1200
  ]);

  const [linhas, setLinhas] = useState([
    1000, 1000
  ]);

  const [modulos, setModulos] = useState({});

  const [selecionado, setSelecionado] = useState(null);

  const tipos = {
    fixo: "#dbeafe",
    maximar: "#fde68a",
    porta: "#fecaca",
    correr: "#bbf7d0",
  };

  function totalLargura() {
    return colunas.reduce((a, b) => a + Number(b), 0);
  }

  function totalAltura() {
    return linhas.reduce((a, b) => a + Number(b), 0);
  }

  function selecionar(col, row) {
    const key = `${col}-${row}`;

    if (!modulos[key]) {
      setModulos({
        ...modulos,
        [key]: {
          tipo: "fixo",
          linha: "Suprema",
          vidro: "Incolor 8mm",
          subdivisoes: [],
        },
      });
    }

    setSelecionado(key);
  }

  function alterarModulo(campo, valor) {
    if (!selecionado) return;

    setModulos({
      ...modulos,
      [selecionado]: {
        ...modulos[selecionado],
        [campo]: valor,
      },
    });
  }

  function dividirVertical() {
    if (!selecionado) return;

    setModulos({
      ...modulos,
      [selecionado]: {
        ...modulos[selecionado],
        subdivisoes: [
          {
            x: 0,
            y: 0,
            w: 0.5,
            h: 1,
            tipo: "fixo",
          },
          {
            x: 0.5,
            y: 0,
            w: 0.5,
            h: 1,
            tipo: "fixo",
          },
        ],
      },
    });
  }

  function dividirHorizontal() {
    if (!selecionado) return;

    setModulos({
      ...modulos,
      [selecionado]: {
        ...modulos[selecionado],
        subdivisoes: [
          {
            x: 0,
            y: 0,
            w: 1,
            h: 0.5,
            tipo: "maximar",
          },
          {
            x: 0,
            y: 0.5,
            w: 1,
            h: 0.5,
            tipo: "fixo",
          },
        ],
      },
    });
  }

  function renderModulo(col, row) {
    const key = `${col}-${row}`;

    const modulo = modulos[key] || {
      tipo: "fixo",
      linha: "Suprema",
      subdivisoes: [],
    };

    return (
      <div
        key={key}
        onClick={() => selecionar(col, row)}
        style={{
          position: "relative",
          border:
            selecionado === key
              ? "3px solid red"
              : "1px solid #222",
          background: "#fff",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {modulo.subdivisoes.length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: tipos[modulo.tipo],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {modulo.tipo}
          </div>
        ) : (
          modulo.subdivisoes.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${s.x * 100}%`,
                top: `${s.y * 100}%`,
                width: `${s.w * 100}%`,
                height: `${s.h * 100}%`,
                border: "1px solid #111",
                background: tipos[s.tipo],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {s.tipo}
            </div>
          ))
        )}

        <div
          style={{
            position: "absolute",
            bottom: 3,
            left: 3,
            background: "#ffffffcc",
            padding: "2px 5px",
            fontSize: 11,
          }}
        >
          {modulo.linha}
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* MENU */}
      <aside style={sidebar}>
        <h2>🏢 Fachada PRO</h2>

        <label>Nome da Fachada</label>
        <input
          style={input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <hr />

        <h3>Cotas Horizontais</h3>

        {colunas.map((c, i) => (
          <input
            key={i}
            style={input}
            value={c}
            onChange={(e) => {
              const novo = [...colunas];
              novo[i] = Number(e.target.value);
              setColunas(novo);
            }}
          />
        ))}

        <button
          style={btn}
          onClick={() => setColunas([...colunas, 1000])}
        >
          + Coluna
        </button>

        <hr />

        <h3>Cotas Verticais</h3>

        {linhas.map((l, i) => (
          <input
            key={i}
            style={input}
            value={l}
            onChange={(e) => {
              const novo = [...linhas];
              novo[i] = Number(e.target.value);
              setLinhas(novo);
            }}
          />
        ))}

        <button
          style={btn}
          onClick={() => setLinhas([...linhas, 1000])}
        >
          + Linha
        </button>

        <hr />

        <h3>Módulo Selecionado</h3>

        <p>{selecionado || "Nenhum"}</p>

        <select
          style={input}
          onChange={(e) =>
            alterarModulo("tipo", e.target.value)
          }
        >
          <option value="fixo">Fixo</option>
          <option value="maximar">Maxim-ar</option>
          <option value="porta">Porta</option>
          <option value="correr">Correr</option>
        </select>

        <select
          style={input}
          onChange={(e) =>
            alterarModulo("linha", e.target.value)
          }
        >
          <option>Suprema</option>
          <option>Gold</option>
        </select>

        <button style={btn} onClick={dividirVertical}>
          Dividir Vertical
        </button>

        <button style={btn} onClick={dividirHorizontal}>
          Dividir Horizontal
        </button>

        <hr />

        <button style={btnGreen}>
          💾 Salvar Fachada
        </button>

        <button style={btnBlue}>
          📋 Materiais / Fórmulas
        </button>

        <button style={btnDark}>
          📊 Relatórios
        </button>
      </aside>

      {/* ÁREA CAD */}
      <main style={main}>
        <h1>{nome}</h1>

        <div style={prancha}>
          {/* COTAS SUPERIORES */}
          <div style={cotasTop}>
            {colunas.map((c, i) => (
              <div
                key={i}
                style={{
                  flex: c,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {c} mm
              </div>
            ))}
          </div>

          <div style={{ display: "flex" }}>
            {/* DESENHO */}
            <div
              style={{
                width: 900,
                height: 550,
                display: "grid",
                gridTemplateColumns: `repeat(${colunas.length}, 1fr)`,
                gridTemplateRows: `repeat(${linhas.length}, 1fr)`,
                gap: 2,
                background: "#111",
              }}
            >
              {linhas.map((_, row) =>
                colunas.map((_, col) =>
                  renderModulo(col, row)
                )
              )}
            </div>

            {/* COTAS LATERAIS */}
            <div style={cotasSide}>
              {linhas.map((l, i) => (
                <div
                  key={i}
                  style={{
                    flex: l,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {l} mm
                </div>
              ))}
            </div>
          </div>

          <div style={footer}>
            Largura Total: {totalLargura()} mm |
            Altura Total: {totalAltura()} mm
          </div>
        </div>
      </main>
    </div>
  );
}

const page = {
  display: "flex",
  minHeight: "100vh",
  background: "#edf2f1",
};

const sidebar = {
  width: 320,
  background: "#0f172a",
  color: "white",
  padding: 20,
};

const main = {
  flex: 1,
  padding: 25,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
};

const btn = {
  width: "100%",
  padding: 10,
  marginBottom: 8,
};

const btnGreen = {
  ...btn,
  background: "#15803d",
  color: "white",
  border: 0,
};

const btnBlue = {
  ...btn,
  background: "#2563eb",
  color: "white",
  border: 0,
};

const btnDark = {
  ...btn,
  background: "#111827",
  color: "white",
  border: 0,
};

const prancha = {
  background: "white",
  padding: 25,
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,.1)",
};

const cotasTop = {
  width: 900,
  display: "flex",
  marginBottom: 10,
};

const cotasSide = {
  height: 550,
  display: "flex",
  flexDirection: "column",
  marginLeft: 10,
};

const footer = {
  marginTop: 12,
  fontWeight: "bold",
};