import React, { useMemo, useState } from "react";

export default function ProducaoIndustrial() {

  // ====================================
  // STATUS
  // ====================================

  const STATUS = [
    "Projeto",
    "Corte",
    "Usinagem",
    "Montagem",
    "Vidro",
    "Expedição",
    "Instalação",
    "Finalizado"
  ];


  // ====================================
  // ESTADOS
  // ====================================

  const [obra, setObra] =
    useState("");

  const [cliente, setCliente] =
    useState("");

  const [tipologia, setTipologia] =
    useState("");

  const [quantidade, setQuantidade] =
    useState(1);

  const [lista, setLista] =
    useState([]);


  // ====================================
  // ADICIONAR
  // ====================================

  const adicionar = () => {

    if (
      !obra ||
      !cliente ||
      !tipologia
    ) return;

    const nova = {

      id: Date.now(),

      obra,

      cliente,

      tipologia,

      quantidade,

      status: "Projeto",

      data:
        new Date()
          .toLocaleDateString()

    };

    setLista([
      ...lista,
      nova
    ]);

    setObra("");
    setCliente("");
    setTipologia("");
    setQuantidade(1);

  };


  // ====================================
  // ALTERAR STATUS
  // ====================================

  const alterarStatus = (
    id,
    status
  ) => {

    setLista(
      lista.map((item) => {

        if (item.id === id) {

          return {
            ...item,
            status
          };

        }

        return item;

      })
    );

  };


  // ====================================
  // DASHBOARD
  // ====================================

  const dashboard = useMemo(() => {

    const resumo = {};

    STATUS.forEach((s) => {
      resumo[s] = 0;
    });

    lista.forEach((item) => {
      resumo[item.status]++;
    });

    return resumo;

  }, [lista]);


  // ====================================
  // COR STATUS
  // ====================================

  const corStatus = (
    status
  ) => {

    if (status === "Projeto")
      return "#cbd5e1";

    if (status === "Corte")
      return "#93c5fd";

    if (status === "Usinagem")
      return "#fcd34d";

    if (status === "Montagem")
      return "#86efac";

    if (status === "Vidro")
      return "#a5f3fc";

    if (status === "Expedição")
      return "#f9a8d4";

    if (status === "Instalação")
      return "#fdba74";

    if (status === "Finalizado")
      return "#4ade80";

    return "#ddd";

  };


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
        Produção Industrial
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Controle Industrial de Produção
      </p>


      {/* DASHBOARD */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(160px,1fr))",
          gap: 15,
          marginBottom: 30
        }}
      >

        {STATUS.map((status) => (

          <div
            key={status}
            style={{
              background:
                corStatus(status),
              padding: 20,
              borderRadius: 15
            }}
          >

            <p>
              {status}
            </p>

            <h2>
              {
                dashboard[status]
              }
            </h2>

          </div>

        ))}

      </div>


      {/* FORMULÁRIO */}

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
            placeholder="Obra"
            value={obra}
            onChange={(e) =>
              setObra(
                e.target.value
              )
            }
            style={styles.input}
          />

          <input
            placeholder="Cliente"
            value={cliente}
            onChange={(e) =>
              setCliente(
                e.target.value
              )
            }
            style={styles.input}
          />

          <input
            placeholder="Tipologia"
            value={tipologia}
            onChange={(e) =>
              setTipologia(
                e.target.value
              )
            }
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Qtd"
            value={quantidade}
            onChange={(e) =>
              setQuantidade(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />

          <button
            onClick={adicionar}
            style={styles.botao}
          >
            Adicionar
          </button>

        </div>

      </div>


      {/* PRODUÇÃO */}

      <div
        style={{
          display: "grid",
          gap: 20
        }}
      >

        {lista.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: 15,
              padding: 20
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center"
              }}
            >

              <div>

                <h2>
                  {item.obra}
                </h2>

                <p>
                  Cliente:
                  {" "}
                  {item.cliente}
                </p>

                <p>
                  Tipologia:
                  {" "}
                  {item.tipologia}
                </p>

                <p>
                  Quantidade:
                  {" "}
                  {item.quantidade}
                </p>

                <p>
                  Data:
                  {" "}
                  {item.data}
                </p>

              </div>


              <div>

                <select
                  value={
                    item.status
                  }
                  onChange={(
                    e
                  ) =>
                    alterarStatus(
                      item.id,
                      e.target
                        .value
                    )
                  }
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background:
                      corStatus(
                        item.status
                      ),
                    border: "none",
                    fontWeight:
                      "bold"
                  }}
                >

                  {STATUS.map(
                    (s) => (

                      <option
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </div>

        ))}

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