import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FachadaMemoriaProducao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/fachadas/${id}/memoria-producao`);
      const data = await res.json();
      setDados(data);
    }
    carregar();
  }, [id]);

  if (!dados) return <div style={{ padding: "20px" }}>Carregando memória...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Memória Técnica / Produção</h1>
      <p><strong>Fachada:</strong> {dados.nome}</p>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Tipologia</th>
            <th>Largura</th>
            <th>Altura</th>
            <th>Perfil</th>
            <th>Acessório</th>
            <th>Vidro</th>
          </tr>
        </thead>
        <tbody>
          {dados.memoria.length === 0 ? (
            <tr><td colSpan="7">Nenhum módulo encontrado</td></tr>
          ) : (
            dados.memoria.map((item, index) => (
              <tr key={index}>
                <td>{item.modulo}</td>
                <td>{item.nome}</td>
                <td>{item.largura}</td>
                <td>{item.altura}</td>
                <td>{item.perfilBase}</td>
                <td>{item.acessorio}</td>
                <td>{item.vidro}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => navigate("/fachadas")} style={{ marginTop: "20px" }}>
        Voltar
      </button>
    </div>
  );
}