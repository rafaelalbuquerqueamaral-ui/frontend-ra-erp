import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Fachadas() {
  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

  async function carregar() {
    const res = await fetch("http://localhost:3001/fachadas");
    const data = await res.json();
    setLista(Array.isArray(data) ? data : []);
  }

  async function excluir(id) {
    await fetch(`http://localhost:3001/fachadas/${id}`, { method: "DELETE" });
    carregar();
  }

  async function gerarOrcamento(id) {
    const res = await fetch(`http://localhost:3001/fachadas/${id}/gerar-orcamento`, {
      method: "POST",
    });
    const data = await res.json();
    navigate(`/orcamentos-fachada/${data.id}`);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Fachadas V5 Industrial Real</h1>

      <button
        onClick={() => navigate("/fachada/nova")}
        style={{
          padding: "10px 14px",
          border: "none",
          background: "#0f172a",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        + Nova Fachada
      </button>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Largura</th>
            <th>Altura</th>
            <th>QX</th>
            <th>QY</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan="7">Nenhuma fachada cadastrada</td>
            </tr>
          ) : (
            lista.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nome}</td>
                <td>{f.largura}</td>
                <td>{f.altura}</td>
                <td>{f.qtdX}</td>
                <td>{f.qtdY}</td>
                <td>
                  <button onClick={() => navigate(`/fachada/${f.id}`)}>Abrir</button>
                  <button onClick={() => navigate(`/fachadas/${f.id}/materiais`)} style={{ marginLeft: "8px" }}>Materiais</button>
                  <button onClick={() => navigate(`/fachadas/${f.id}/lista-corte`)} style={{ marginLeft: "8px" }}>Corte</button>
                  <button onClick={() => navigate(`/fachadas/${f.id}/memoria-producao`)} style={{ marginLeft: "8px" }}>Produção</button>
                  <button onClick={() => navigate(`/fachadas/${f.id}/prancha`)} style={{ marginLeft: "8px" }}>Prancha</button>
                  <button onClick={() => gerarOrcamento(f.id)} style={{ marginLeft: "8px" }}>Orçamento</button>
                  <button onClick={() => excluir(f.id)} style={{ marginLeft: "8px" }}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}