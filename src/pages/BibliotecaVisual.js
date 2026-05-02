import { useEffect, useState } from "react";

export default function BibliotecaVisual() {
  const API = "http://localhost:3001";

  const [aba, setAba] = useState("perfis");
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregar();
  }, [aba]);

  async function carregar() {
    const r = await fetch(`${API}/${aba}`);
    const d = await r.json();
    setDados(Array.isArray(d) ? d : []);
  }

  const lista = dados.filter((item) =>
    `${item.codigo || ""} ${item.descricao || ""} ${item.nome || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div style={pagina}>
      <h1>📚 Biblioteca Visual</h1>
      <p>Biblioteca de perfis, acessórios, vidros e materiais com imagem.</p>

      <div style={abas}>
        <button onClick={() => setAba("perfis")} style={aba === "perfis" ? ativo : botao}>Perfis</button>
        <button onClick={() => setAba("acessorios")} style={aba === "acessorios" ? ativo : botao}>Acessórios</button>
        <button onClick={() => setAba("vidros")} style={aba === "vidros" ? ativo : botao}>Vidros</button>
        <button onClick={() => setAba("cores")} style={aba === "cores" ? ativo : botao}>Cores</button>
      </div>

      <input
        style={pesquisa}
        placeholder="Pesquisar código, nome ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div style={grid}>
        {lista.map((item) => (
          <div key={item.id} style={card}>
            <div style={imagemBox}>
              {item.imagem ? (
                <img src={item.imagem} alt="" style={imagem} />
              ) : (
                <DesenhoPadrao tipo={aba} />
              )}
            </div>

            <h3>{item.codigo || item.nome || item.descricao}</h3>
            <p>{item.descricao || item.nome}</p>

            {aba === "perfis" && (
              <>
                <small>Peso: {item.peso_kg_m || 0} kg/m</small><br />
                <small>Barra: {item.barra || 6000} mm</small><br />
                <small>Linha: {item.linha || "DIVERSOS"}</small>
              </>
            )}

            {aba === "acessorios" && (
              <>
                <small>Unidade: {item.unidade || "UN"}</small><br />
                <small>Custo: R$ {Number(item.custo || item.valor_unitario || 0).toFixed(2)}</small>
              </>
            )}

            {aba === "vidros" && (
              <>
                <small>Espessura: {item.espessura || 0} mm</small><br />
                <small>Custo m²: R$ {Number(item.custo_m2 || 0).toFixed(2)}</small>
              </>
            )}

            {aba === "cores" && (
              <>
                <small>Custo kg: R$ {Number(item.custo_kg || 0).toFixed(2)}</small>
              </>
            )}

            <button style={btnSelecionar}>Selecionar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesenhoPadrao({ tipo }) {
  if (tipo === "perfis") {
    return (
      <svg width="120" height="70">
        <polyline
          points="10,40 45,40 45,55 85,55 85,25 115,25"
          fill="none"
          stroke="black"
          strokeWidth="4"
        />
      </svg>
    );
  }

  if (tipo === "vidros") {
    return <div style={{ width: 100, height: 60, background: "#dbeafe", border: "2px solid #60a5fa" }} />;
  }

  if (tipo === "cores") {
    return <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#94a3b8" }} />;
  }

  return <div style={{ fontSize: 40 }}>🔩</div>;
}

const pagina = {
  padding: 30,
  background: "#eef3f2",
  minHeight: "100vh",
};

const abas = {
  display: "flex",
  gap: 10,
  marginBottom: 15,
};

const botao = {
  padding: "12px 18px",
  border: "1px solid #999",
  background: "#e5ecea",
  cursor: "pointer",
};

const ativo = {
  padding: "12px 18px",
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "white",
  cursor: "pointer",
};

const pesquisa = {
  width: "100%",
  padding: 14,
  borderRadius: 10,
  border: "1px solid #cbd5d1",
  marginBottom: 25,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  background: "white",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
};

const imagemBox = {
  height: 110,
  background: "#f1f5f9",
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
};

const imagem = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
};

const btnSelecionar = {
  marginTop: 15,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: 0,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
};