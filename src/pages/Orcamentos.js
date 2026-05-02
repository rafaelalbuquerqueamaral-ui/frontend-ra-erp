import React, {
  useEffect,
  useState,
} from "react";

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] =
    useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(
        "http://localhost:3001/orcamentos"
      );

      const data = await res.json();

      setOrcamentos(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(error);

      setOrcamentos([]);
    }
  }

  async function excluir(id) {
    if (
      !window.confirm(
        "Excluir orçamento?"
      )
    )
      return;

    try {
      await fetch(
        `http://localhost:3001/orcamentos/${id}`,
        {
          method: "DELETE",
        }
      );

      carregar();
    } catch (error) {
      console.log(error);
    }
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#eef2f7",
        minHeight: "100vh",
      }}
    >
      <h1>Histórico de Orçamentos</h1>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>

              <th>Tipologia</th>

              <th>Largura</th>

              <th>Altura</th>

              <th>Venda</th>

              <th>Data</th>

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {orcamentos.map((orc) => (
              <tr key={orc.id}>
                <td>{orc.id}</td>

                <td>
                  {orc.tipologia_id}
                </td>

                <td>
                  {orc.largura}
                </td>

                <td>
                  {orc.altura}
                </td>

                <td>
                  {dinheiro(
                    orc.venda_total
                  )}
                </td>

                <td>
                  {new Date(
                    orc.created_at
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </td>

                <td>
                  <button>
                    Abrir
                  </button>

                  <button>
                    PDF
                  </button>

                  <button
                    onClick={() =>
                      excluir(orc.id)
                    }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orcamentos.length === 0 && (
          <p>
            Nenhum orçamento salvo.
          </p>
        )}
      </div>
    </div>
  );
}