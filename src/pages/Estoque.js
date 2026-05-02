import React, {
  useEffect,
  useState,
} from "react";

export default function Estoque() {
  const [itens, setItens] =
    useState([]);

  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    unidade: "UN",
    quantidade: 0,
    valor_unitario: 0,
    estoque_minimo: 0,
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await fetch(
        "http://localhost:3001/estoque"
      );

      const data = await res.json();

      setItens(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function salvar() {
    try {
      await fetch(
        "http://localhost:3001/estoque",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            form
          ),
        }
      );

      carregar();

      setForm({
        nome: "",
        categoria: "",
        unidade: "UN",
        quantidade: 0,
        valor_unitario: 0,
        estoque_minimo: 0,
      });
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
        Estoque Industrial
      </h1>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(6,1fr)",
            gap: 10,
          }}
        >
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) =>
              setForm({
                ...form,
                nome:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) =>
              setForm({
                ...form,
                categoria:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Unidade"
            value={form.unidade}
            onChange={(e) =>
              setForm({
                ...form,
                unidade:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Qtd"
            value={form.quantidade}
            onChange={(e) =>
              setForm({
                ...form,
                quantidade:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Valor"
            value={
              form.valor_unitario
            }
            onChange={(e) =>
              setForm({
                ...form,
                valor_unitario:
                  e.target.value,
              })
            }
          />

          <button
            onClick={salvar}
          >
            Salvar
          </button>
        </div>

        <table
          style={{
            width: "100%",
            marginTop: 30,
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Nome</th>

              <th>
                Categoria
              </th>

              <th>Unidade</th>

              <th>Qtd</th>

              <th>Valor</th>

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>

                <td>
                  {item.categoria}
                </td>

                <td>
                  {item.unidade}
                </td>

                <td>
                  {item.quantidade}
                </td>

                <td>
                  {Number(
                    item.valor_unitario
                  ).toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </td>

                <td>
                  {(
                    item.quantidade *
                    item.valor_unitario
                  ).toLocaleString(
                    "pt-BR",
                    {
                      style:
                        "currency",
                      currency:
                        "BRL",
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}