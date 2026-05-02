import { useEffect, useState } from "react";

export default function LinhasAluminio() {
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");

  async function carregar() {
    try {
      const res = await fetch("http://localhost:3001/linhas");
      const data = await res.json();
      setLista(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar linhas");
    }
  }

  async function salvar() {
    try {
      if (!nome.trim()) {
        alert("Informe o nome da linha");
        return;
      }

      const res = await fetch("http://localhost:3001/linhas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, marca }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Erro ao salvar linha");
      }

      setNome("");
      setMarca("");
      carregar();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao salvar linha");
    }
  }

  async function excluir(id) {
    try {
      const res = await fetch(`http://localhost:3001/linhas/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Erro ao excluir linha");
      }

      carregar();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao excluir linha");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Linhas de Alumínio</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Nome da linha"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <button onClick={salvar}>Salvar</button>
      </div>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Marca</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: 10 }}>
                Nenhuma linha cadastrada
              </td>
            </tr>
          ) : (
            lista.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nome}</td>
                <td>{item.marca}</td>
                <td>
                  <button onClick={() => excluir(item.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}