import React, {
  useEffect,
  useState,
} from "react";

const STATUS = [
  "EM PROJETO",
  "CORTE",
  "USINAGEM",
  "MONTAGEM",
  "VIDRO",
  "EXPEDIÇÃO",
  "INSTALAÇÃO",
  "FINALIZADO",
];

export default function Producao() {
  const [ops, setOps] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(
        "http://localhost:3001/ordens-producao"
      );

      const data = await res.json();

      setOps(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function alterarStatus(
    id,
    status
  ) {
    try {
      await fetch(
        `http://localhost:3001/ordens-producao/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      carregar();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#eef2f7",
        minHeight: "100vh",
      }}
    >
      <h1>
        Ordens de Produção
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        {STATUS.map((status) => (
          <div
            key={status}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <h3>{status}</h3>

            {ops
              .filter(
                (op) =>
                  op.status ===
                  status
              )
              .map((op) => (
                <div
                  key={op.id}
                  style={{
                    background:
                      "#f1f5f9",
                    padding: 15,
                    borderRadius: 12,
                    marginTop: 10,
                  }}
                >
                  <strong>
                    OP #{op.id}
                  </strong>

                  <p>
                    Orçamento:{" "}
                    {
                      op.orcamento_id
                    }
                  </p>

                  <select
                    value={
                      op.status
                    }
                    onChange={(e) =>
                      alterarStatus(
                        op.id,
                        e.target
                          .value
                      )
                    }
                  >
                    {STATUS.map(
                      (s) => (
                        <option
                          key={s}
                        >
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}