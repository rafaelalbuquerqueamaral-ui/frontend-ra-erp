import { useState } from "react";

export default function OrcamentoIndustrial() {
  const [form, setForm] = useState({
    largura: 2000,
    altura: 1200,
    tipo_vidro: "incolor",
    peso1: 1.2,
    metros1: 6,
    peso2: 0.8,
    metros2: 4,
  });

  const [resultado, setResultado] = useState(null);

  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function calcular() {
    try {
      const resposta = await fetch("http://localhost:3001/orcamento-industrial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          largura: Number(form.largura),
          altura: Number(form.altura),
          tipo_vidro: form.tipo_vidro,
          perfis: [
            { peso_kg_m: Number(form.peso1), metros: Number(form.metros1) },
            { peso_kg_m: Number(form.peso2), metros: Number(form.metros2) },
          ],
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao calcular");
        return;
      }

      setResultado(dados);
    } catch (e) {
      alert("Backend não conectado");
    }
  }

  const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d0d7de",
    width: "100%",
    marginBottom: "12px",
    fontSize: "14px",
  };

  return (
    <div style={{ padding: "30px", background: "#f3f6fa", minHeight: "100vh" }}>
      <h1 style={{ color: "#0f172a" }}>🏭 Motor de Cálculo Industrial</h1>
      <p style={{ color: "#64748b" }}>
        Cálculo automático por alumínio kg, pintura kg, vidro m² e margem.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px",
        marginTop: "25px"
      }}>
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}>
          <h2>📐 Dados da Esquadria</h2>

          <label>Largura mm</label>
          <input style={inputStyle} value={form.largura}
            onChange={e => alterar("largura", e.target.value)} />

          <label>Altura mm</label>
          <input style={inputStyle} value={form.altura}
            onChange={e => alterar("altura", e.target.value)} />

          <label>Tipo de vidro</label>
          <select style={inputStyle} value={form.tipo_vidro}
            onChange={e => alterar("tipo_vidro", e.target.value)}>
            <option value="incolor">Incolor</option>
            <option value="fume">Fumê</option>
            <option value="verde">Verde</option>
            <option value="temperado">Temperado</option>
            <option value="laminado">Laminado</option>
          </select>

          <h3>Perfil 1</h3>
          <input style={inputStyle} placeholder="Peso kg/m" value={form.peso1}
            onChange={e => alterar("peso1", e.target.value)} />
          <input style={inputStyle} placeholder="Metros" value={form.metros1}
            onChange={e => alterar("metros1", e.target.value)} />

          <h3>Perfil 2</h3>
          <input style={inputStyle} placeholder="Peso kg/m" value={form.peso2}
            onChange={e => alterar("peso2", e.target.value)} />
          <input style={inputStyle} placeholder="Metros" value={form.metros2}
            onChange={e => alterar("metros2", e.target.value)} />

          <button
            onClick={calcular}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(135deg,#0f172a,#2563eb)",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            ⚙️ Calcular Orçamento
          </button>
        </div>

        <div style={{
          background: "#0f172a",
          color: "white",
          padding: "25px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.20)"
        }}>
          <h2>💰 Resultado Industrial</h2>

          {!resultado && (
            <p style={{ color: "#94a3b8" }}>
              Preencha os dados e clique em calcular.
            </p>
          )}

          {resultado && (
            <>
              <Card titulo="Perfis" valor={resultado.perfis} />
              <Card titulo="Vidro" valor={resultado.vidro} />
              <Card titulo="Custo" valor={resultado.custo} />
              <Card titulo="Lucro" valor={resultado.lucro} />

              <div style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg,#16a34a,#22c55e)"
              }}>
                <p>Total de venda</p>
                <h1>R$ {Number(resultado.total || 0).toFixed(2)}</h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.08)",
      padding: "15px",
      borderRadius: "14px",
      marginBottom: "12px"
    }}>
      <p style={{ margin: 0, color: "#cbd5e1" }}>{titulo}</p>
      <h2 style={{ margin: 0 }}>R$ {Number(valor || 0).toFixed(2)}</h2>
    </div>
  );
}