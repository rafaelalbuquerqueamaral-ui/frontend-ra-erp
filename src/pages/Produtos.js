import { useEffect, useState } from "react";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");

  function carregar() {
    fetch("http://localhost:3001/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((error) => {
        console.log("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos");
      });
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    try {
      const resposta = await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          tipo,
          valor: Number(valor),
        }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        alert(data.erro || "Erro ao salvar produto");
        return;
      }

      setNome("");
      setTipo("");
      setValor("");
      carregar();
    } catch (error) {
      console.log("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto");
    }
  }

  async function excluir(id) {
    try {
      await fetch(`http://localhost:3001/produtos/${id}`, {
        method: "DELETE",
      });
      carregar();
    } catch (error) {
      console.log("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  }

  return (
    <div>
      <h1>Produtos</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <input
        placeholder="Valor"
        type="number"
        step="any"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={salvar} style={{ marginLeft: "10px" }}>
        Salvar
      </button>

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.tipo}</td>
              <td>R$ {Number(p.valor).toFixed(2)}</td>
              <td>
                <button onClick={() => excluir(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}