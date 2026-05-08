import { useEffect, useState } from "react";

export default function Cores() {

  const [cores, setCores] = useState([]);

  const [formulario, setFormulario] = useState({
    codigo: "",
    descricao: "",
    custo_kg: ""
  });

  async function carregar() {

    try {

      const resposta = await fetch("http://localhost:3001/cores");

      const dados = await resposta.json();

      setCores(dados);

    } catch (erro) {
      console.log(erro);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {

    e.preventDefault();

    try {

      await fetch("http://localhost:3001/cores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      });

      setFormulario({
        codigo: "",
        descricao: "",
        custo_kg: ""
      });

      carregar();

      alert("Cor salva");

    } catch (erro) {

      console.log(erro);

      alert("Erro ao salvar");
    }
  }

  async function excluir(id) {

    if (!window.confirm("Excluir cor?")) {
      return;
    }

    await fetch(`http://localhost:3001/cores/${id}`, {
      method: "DELETE"
    });

    carregar();
  }

  async function reajustar() {

    const percentual = prompt("Percentual de reajuste");

    if (!percentual) return;

    await fetch("http://localhost:3001/cores-reajuste", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        percentual
      })
    });

    carregar();

    alert("Preços reajustados");
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>Tratamento / Cores</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >

        <button onClick={reajustar}>
          $ Ajustar Preços
        </button>

      </div>

      <form
        onSubmit={salvar}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: 10,
          marginBottom: 20
        }}
      >

        <input
          placeholder="Código"
          value={formulario.codigo}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              codigo: e.target.value
            })
          }
        />

        <input
          placeholder="Descrição"
          value={formulario.descricao}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              descricao: e.target.value
            })
          }
        />

        <input
          placeholder="Custo kg"
          value={formulario.custo_kg}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              custo_kg: e.target.value
            })
          }
        />

        <button type="submit">
          Salvar
        </button>

      </form>

      <table width="100%" border="1" cellPadding="8">

        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Custo kg</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {cores.map((item) => (

            <tr key={item.id}>

              <td>{item.codigo}</td>

              <td>{item.descricao}</td>

              <td>
                R$ {item.custo_kg}
              </td>

              <td>

                <button
                  onClick={() => excluir(item.id)}
                >
                  Excluir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}