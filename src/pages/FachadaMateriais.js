import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FachadaMateriais() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/fachadas/${id}/materiais`);
      const data = await res.json();
      setDados(data);
    }
    carregar();
  }, [id]);

  if (!dados) return <div style={{ padding: "20px" }}>Carregando...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Materiais da Fachada</h1>
      <p><strong>Fachada:</strong> {dados.nome}</p>
      <p><strong>Área total:</strong> {dados.areaVidroTotal} m²</p>
      <p><strong>Perímetro total:</strong> {dados.perimetroTotal} m</p>
      <p><strong>Valor total:</strong> R$ {Number(dados.valorTotal).toFixed(2)}</p>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Qtd</th>
            <th>Área</th>
            <th>Perímetro</th>
            <th>Perfil</th>
            <th>Acessório</th>
            <th>Vidro</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {dados.itens.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>{item.area}</td>
              <td>{item.perimetro}</td>
              <td>{item.perfilBase}</td>
              <td>{item.acessorio}</td>
              <td>{item.vidro}</td>
              <td>R$ {Number(item.valor).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/fachadas")} style={{ marginTop: "20px" }}>
        Voltar
      </button>
    </div>
  );
}