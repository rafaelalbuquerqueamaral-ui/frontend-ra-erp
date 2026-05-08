import React, {
  useMemo,
  useState
} from "react";

export default function FinanceiroIndustrial() {

  // ====================================
  // ESTADOS
  // ====================================

  const [descricao, setDescricao] =
    useState("");

  const [tipo, setTipo] =
    useState("Receber");

  const [categoria, setCategoria] =
    useState("Obra");

  const [valor, setValor] =
    useState("");

  const [status, setStatus] =
    useState("Pendente");

  const [lista, setLista] =
    useState([]);


  // ====================================
  // ADICIONAR
  // ====================================

  const adicionar = () => {

    if (
      !descricao ||
      !valor
    ) return;

    const nova = {

      id: Date.now(),

      descricao,

      tipo,

      categoria,

      valor:
        Number(valor),

      status,

      data:
        new Date()
          .toLocaleDateString()

    };

    setLista([
      ...lista,
      nova
    ]);

    setDescricao("");
    setValor("");

  };


  // ====================================
  // RESUMO
  // ====================================

  const resumo = useMemo(() => {

    let receber = 0;
    let pagar = 0;
    let recebido = 0;
    let pago = 0;

    lista.forEach((item) => {

      if (
        item.tipo ===
        "Receber"
      ) {

        receber +=
          item.valor;

        if (
          item.status ===
          "Pago"
        ) {

          recebido +=
            item.valor;

        }

      }


      if (
        item.tipo ===
        "Pagar"
      ) {

        pagar +=
          item.valor;

        if (
          item.status ===
          "Pago"
        ) {

          pago +=
            item.valor;

        }

      }

    });

    return {

      receber,

      pagar,

      recebido,

      pago,

      lucro:
        recebido - pago

    };

  }, [lista]);


  // ====================================
  // FORMATAR
  // ====================================

  const moeda = (
    valor
  ) => {

    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style:
          "currency",
        currency:
          "BRL"
      }
    );

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
        Financeiro Industrial
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Controle financeiro industrial
      </p>


      {/* DASHBOARD */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
          marginBottom: 30
        }}
      >

        <Card
          titulo="Receber"
          valor={
            moeda(
              resumo.receber
            )
          }
          cor="#93c5fd"
        />

        <Card
          titulo="Pagar"
          valor={
            moeda(
              resumo.pagar
            )
          }
          cor="#fca5a5"
        />

        <Card
          titulo="Recebido"
          valor={
            moeda(
              resumo.recebido
            )
          }
          cor="#86efac"
        />

        <Card
          titulo="Lucro"
          valor={
            moeda(
              resumo.lucro
            )
          }
          cor="#4ade80"
        />

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
              "2fr 1fr 1fr 1fr 1fr auto",
            gap: 10
          }}
        >

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) =>
              setDescricao(
                e.target.value
              )
            }
            style={styles.input}
          />


          <select
            value={tipo}
            onChange={(e) =>
              setTipo(
                e.target.value
              )
            }
            style={styles.input}
          >

            <option>
              Receber
            </option>

            <option>
              Pagar
            </option>

          </select>


          <select
            value={categoria}
            onChange={(e) =>
              setCategoria(
                e.target.value
              )
            }
            style={styles.input}
          >

            <option>
              Obra
            </option>

            <option>
              Alumínio
            </option>

            <option>
              Vidro
            </option>

            <option>
              Acessórios
            </option>

            <option>
              Funcionários
            </option>

          </select>


          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) =>
              setValor(
                e.target.value
              )
            }
            style={styles.input}
          />


          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            style={styles.input}
          >

            <option>
              Pendente
            </option>

            <option>
              Pago
            </option>

          </select>


          <button
            onClick={adicionar}
            style={styles.botao}
          >
            Adicionar
          </button>

        </div>

      </div>


      {/* TABELA */}

      <div
        style={{
          background: "#fff",
          borderRadius: 15,
          overflow: "hidden"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >

          <thead
            style={{
              background:
                "#0f172a",
              color: "#fff"
            }}
          >

            <tr>

              <th style={styles.th}>
                Data
              </th>

              <th style={styles.th}>
                Descrição
              </th>

              <th style={styles.th}>
                Tipo
              </th>

              <th style={styles.th}>
                Categoria
              </th>

              <th style={styles.th}>
                Valor
              </th>

              <th style={styles.th}>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {lista.map((item) => (

              <tr
                key={item.id}
              >

                <td style={styles.td}>
                  {item.data}
                </td>

                <td style={styles.td}>
                  {
                    item.descricao
                  }
                </td>

                <td style={styles.td}>
                  {item.tipo}
                </td>

                <td style={styles.td}>
                  {
                    item.categoria
                  }
                </td>

                <td style={styles.td}>
                  {
                    moeda(
                      item.valor
                    )
                  }
                </td>

                <td style={styles.td}>
                  <span
                    style={{
                      background:
                        item.status ===
                        "Pago"
                          ? "#86efac"
                          : "#fcd34d",

                      padding:
                        "6px 12px",

                      borderRadius:
                        20
                    }}
                  >

                    {
                      item.status
                    }

                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}


// ====================================
// CARD
// ====================================

function Card({
  titulo,
  valor,
  cor
}) {

  return (

    <div
      style={{
        background: cor,
        padding: 20,
        borderRadius: 15
      }}
    >

      <p>
        {titulo}
      </p>

      <h2>
        {valor}
      </h2>

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
  },

  th: {
    padding: 15,
    textAlign: "left"
  },

  td: {
    padding: 15,
    borderBottom:
      "1px solid #eee"
  }

};