import { useEffect, useState } from "react";

export default function VidrosPRO() {
  const API = "http://localhost:3001";
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    fetch(API + "/vidros")
      .then(r => r.json())
      .then(setDados);
  }

  const filtrado = dados.filter(v =>
    v.descricao?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: 20, background: "#f4f6f9", height: "100vh" }}>

      {/* TOPO */}
      <div style={{
        display: "flex",
        gap: 10,
        marginBottom: 15,
        alignItems: "center"
      }}>
        <button className="btn">
          + Novo Vidro / Chapa
        </button>

        <button className="btn-sec">
          💰 Ajustar Preços
        </button>

        <input
          placeholder="Pesquisar..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="input"
        />
      </div>

      {/* TABELA */}
      <div className="card">
        <table className="tabela">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Espessura</th>
              <th>Custo m²</th>
              <th>Categoria</th>
              <th>Grupo</th>
              <th>Largura</th>
              <th>Altura</th>
              <th>Área Min</th>
              <th>Arred</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrado.map((v, i) => (
              <tr key={v.id} className={i === 0 ? "linha-ativa" : ""}>
                <td>{v.codigo}</td>
                <td>{v.descricao}</td>
                <td>{v.espessura} mm</td>
                <td>R$ {v.custo_m2}</td>
                <td>{v.categoria}</td>
                <td>{v.grupo}</td>
                <td>{v.largura_padrao}</td>
                <td>{v.altura_padrao}</td>
                <td>{v.area_min}</td>
                <td>{v.arredondamento}</td>

                <td>
                  <button className="acoes">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS INTERNO */}
      <style>{`
        .card {
          background: white;
          border-radius: 10px;
          padding: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .tabela {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .tabela th {
          background: #e9f0e4;
          text-align: left;
          padding: 10px;
          font-weight: bold;
        }

        .tabela td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .tabela tr:hover {
          background: #f5f5f5;
        }

        .linha-ativa {
          background: #f7e98f !important;
        }

        .btn {
          background: #2e7d32;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-sec {
          background: #1976d2;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .input {
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 200px;
        }

        .acoes {
          background: #ddd;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}