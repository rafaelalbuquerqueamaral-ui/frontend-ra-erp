import React, {
  useMemo,
  useState
} from "react";

export default function PlanoDeCorte() {

  // ====================================
  // CONFIG
  // ====================================

  const [barra,
    setBarra] =
    useState(6000);

  const [perda,
    setPerda] =
    useState(3);

  const [entrada,
    setEntrada] =
    useState("");

  const [pecas,
    setPecas] =
    useState([]);


  // ====================================
  // ADICIONAR PEÇA
  // ====================================

  const adicionarPeca = () => {

    if (!entrada) return;

    setPecas([

      ...pecas,

      {
        id: Date.now(),
        medida:
          Number(entrada)
      }

    ]);

    setEntrada("");

  };


  // ====================================
  // REMOVER
  // ====================================

  const remover = (id) => {

    setPecas(

      pecas.filter(
        (p) =>
          p.id !== id
      )

    );

  };


  // ====================================
  // MOTOR OTIMIZAÇÃO
  // ====================================

  const resultado =
    useMemo(() => {

      // ==========================
      // ORDENAR
      // ==========================

      const lista =
        [...pecas]

          .sort(
            (a, b) =>
              b.medida -
              a.medida
          );


      // ==========================
      // BARRAS
      // ==========================

      const barras = [];


      // ==========================
      // DISTRIBUIR
      // ==========================

      lista.forEach((peca) => {

        let encaixou = false;

        for (let barraItem of barras) {

          const usado =
            barraItem.usado;

          const restante =
            barra -
            usado;

          if (

            restante >=
            peca.medida + perda

          ) {

            barraItem.pecas.push(
              peca
            );

            barraItem.usado +=

              peca.medida +
              perda;

            encaixou = true;

            break;

          }

        }


        // ======================
        // NOVA BARRA
        // ======================

        if (!encaixou) {

          barras.push({

            pecas: [peca],

            usado:
              peca.medida +
              perda

          });

        }

      });


      // ==========================
      // SOBRAS
      // ==========================

      const final =
        barras.map((b) => ({

          ...b,

          sobra:
            barra - b.usado

        }));


      return final;

    }, [
      pecas,
      barra,
      perda
    ]);


  // ====================================

  return (

    <div
      style={{
        padding: 30,
        background: "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      <h1
        style={{
          fontSize: 38,
          marginBottom: 10
        }}
      >
        Plano de Corte
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Otimização industrial
      </p>


      {/* CONFIG */}

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
              "repeat(4,1fr)",
            gap: 15
          }}
        >

          <input
            type="number"
            value={barra}
            onChange={(e) =>
              setBarra(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Barra"
            style={styles.input}
          />


          <input
            type="number"
            value={perda}
            onChange={(e) =>
              setPerda(
                Number(
                  e.target.value
                )
              )
            }
            placeholder="Perda"
            style={styles.input}
          />


          <input
            type="number"
            value={entrada}
            onChange={(e) =>
              setEntrada(
                e.target.value
              )
            }
            placeholder="Peça"
            style={styles.input}
          />


          <button
            onClick={
              adicionarPeca
            }
            style={styles.botao}
          >
            Adicionar
          </button>

        </div>

      </div>


      {/* PEÇAS */}

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 15,
          marginBottom: 30
        }}
      >

        <h2>
          Peças
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10
          }}
        >

          {pecas.map((p) => (

            <div
              key={p.id}
              style={{
                background:
                  "#dbeafe",
                padding:
                  "10px 15px",
                borderRadius:
                  10
              }}
            >

              {p.medida}
              mm

              <button
                onClick={() =>
                  remover(p.id)
                }
                style={{
                  marginLeft: 10,
                  border: "none",
                  background:
                    "transparent",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>

            </div>

          ))}

        </div>

      </div>


      {/* RESULTADO */}

      <div
        style={{
          display: "grid",
          gap: 20
        }}
      >

        {resultado.map(
          (barraItem, index) => (

            <div
              key={index}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 15
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: 20
                }}
              >

                <h2>
                  Barra {index + 1}
                </h2>

                <strong>
                  Sobra:
                  {" "}
                  {
                    barraItem.sobra
                  }
                  mm
                </strong>

              </div>


              {/* BARRA */}

              <div
                style={{
                  display: "flex",
                  height: 80,
                  border:
                    "2px solid #0f172a",
                  overflow: "hidden"
                }}
              >

                {barraItem.pecas.map(
                  (
                    peca,
                    i
                  ) => (

                    <div
                      key={i}
                      style={{
                        width:

                          `${
                            (
                              peca.medida /
                              barra
                            ) * 100
                          }%`,

                        background:
                          "#93c5fd",

                        borderRight:
                          "2px solid #fff",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        fontWeight:
                          "bold"

                      }}
                    >

                      {
                        peca.medida
                      }

                    </div>

                  )
                )}

              </div>


              {/* LISTA */}

              <div
                style={{
                  marginTop: 20
                }}
              >

                {barraItem.pecas.map(
                  (
                    peca,
                    i
                  ) => (

                    <div
                      key={i}
                      style={{
                        padding: 10,
                        borderBottom:
                          "1px solid #eee"
                      }}
                    >

                      Peça:
                      {" "}
                      {
                        peca.medida
                      }
                      mm

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

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