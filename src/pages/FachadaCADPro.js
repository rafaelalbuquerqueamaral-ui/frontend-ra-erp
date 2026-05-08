import React, { useState } from "react";

export default function FachadaCADPro() {

  // ====================================
  // CONFIGURAÇÕES
  // ====================================

  const [colunas, setColunas] =
    useState(4);

  const [linhas, setLinhas] =
    useState(3);

  const [larguraModulo, setLarguraModulo] =
    useState(1000);

  const [alturaModulo, setAlturaModulo] =
    useState(1200);

  const [modulos, setModulos] =
    useState([]);


  // ====================================
  // GERAR GRADE
  // ====================================

  const gerarGrade = () => {

    const lista = [];

    for (
      let y = 0;
      y < linhas;
      y++
    ) {

      for (
        let x = 0;
        x < colunas;
        x++
      ) {

        lista.push({
          id: `${x}-${y}`,
          x,
          y,
          tipo: "FIXO",
          largura:
            larguraModulo,
          altura:
            alturaModulo
        });

      }

    }

    setModulos(lista);
  };


  // ====================================
  // ALTERAR TIPO
  // ====================================

  const alterarTipo = (
    id,
    tipo
  ) => {

    setModulos(
      modulos.map((m) => {

        if (m.id === id) {

          return {
            ...m,
            tipo
          };

        }

        return m;

      })
    );

  };


  // ====================================
  // CORES
  // ====================================

  const corModulo = (
    tipo
  ) => {

    if (tipo === "FIXO")
      return "#cbd5e1";

    if (tipo === "PORTA")
      return "#93c5fd";

    if (tipo === "CORRER")
      return "#86efac";

    if (tipo === "MAXIMAR")
      return "#fca5a5";

    return "#ddd";

  };


  // ====================================

  return (

    <div
      style={{
        padding: 30,
        background: "#e2e8f0",
        minHeight: "100vh"
      }}
    >

      <h1
        style={{
          fontSize: 38,
          marginBottom: 10
        }}
      >
        FachadaCADPro
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Sistema Industrial de Fachadas
      </p>


      {/* CONFIGURAÇÕES */}

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 15,
          marginBottom: 30
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: 15
          }}
        >

          <input
            type="number"
            value={colunas}
            onChange={(e) =>
              setColunas(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Colunas"
            style={styles.input}
          />

          <input
            type="number"
            value={linhas}
            onChange={(e) =>
              setLinhas(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Linhas"
            style={styles.input}
          />

          <input
            type="number"
            value={
              larguraModulo
            }
            onChange={(e) =>
              setLarguraModulo(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Largura"
            style={styles.input}
          />

          <input
            type="number"
            value={
              alturaModulo
            }
            onChange={(e) =>
              setAlturaModulo(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Altura"
            style={styles.input}
          />

          <button
            onClick={
              gerarGrade
            }
            style={styles.botao}
          >
            Gerar Fachada
          </button>

        </div>

      </div>


      {/* LEGENDA */}

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20
        }}
      >

        <Legenda
          cor="#cbd5e1"
          nome="Fixo"
        />

        <Legenda
          cor="#93c5fd"
          nome="Porta"
        />

        <Legenda
          cor="#86efac"
          nome="Correr"
        />

        <Legenda
          cor="#fca5a5"
          nome="Maxim-ar"
        />

      </div>


      {/* PRANCHA */}

      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          overflow: "auto"
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              `repeat(${colunas}, 220px)`,
            gap: 10
          }}
        >

          {modulos.map(
            (modulo) => (

              <div
                key={modulo.id}
                style={{
                  width: 220,
                  height: 220,
                  border:
                    "2px solid #0f172a",
                  background:
                    corModulo(
                      modulo.tipo
                    ),
                  display: "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "space-between",
                  padding: 10,
                  borderRadius: 10
                }}
              >

                <div>

                  <strong>
                    {
                      modulo.tipo
                    }
                  </strong>

                </div>


                <div
                  style={{
                    textAlign:
                      "center"
                  }}
                >

                  <div
                    style={{
                      border:
                        "2px solid #000",
                      height: 120,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center"
                    }}
                  >

                    {
                      modulo.tipo
                    }

                  </div>

                </div>


                <div>

                  <select
                    value={
                      modulo.tipo
                    }
                    onChange={(
                      e
                    ) =>
                      alterarTipo(
                        modulo.id,
                        e.target
                          .value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 8
                    }}
                  >

                    <option value="FIXO">
                      FIXO
                    </option>

                    <option value="PORTA">
                      PORTA
                    </option>

                    <option value="CORRER">
                      CORRER
                    </option>

                    <option value="MAXIMAR">
                      MAXIMAR
                    </option>

                  </select>

                </div>


                <div
                  style={{
                    fontSize: 12
                  }}
                >

                  {modulo.largura}
                  {" x "}
                  {modulo.altura}
                  mm

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}


// ====================================
// LEGENDA
// ====================================

function Legenda({
  cor,
  nome
}) {

  return (

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
    >

      <div
        style={{
          width: 20,
          height: 20,
          background: cor,
          borderRadius: 5
        }}
      />

      <span>
        {nome}
      </span>

    </div>

  );
}


// ====================================
// ESTILOS
// ====================================

const styles = {

  input: {
    padding: 12,
    borderRadius: 10,
    border:
      "1px solid #ccc"
  },

  botao: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  }

};