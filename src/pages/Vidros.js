import { useEffect, useState } from "react";
import api from "../services/api";

export default function Vidros() {
  const [vidros, setVidros] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    espessura: "",
    cor: "",
    valor_m2: "",
    observacao: "",
  });

  useEffect(() => {
    carregarVidros();
  }, []);

  async function carregarVidros() {
    try {
      const res = await api.get("/vidros");
      setVidros(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setVidros([]);
    }
  }

  async function salvarVidro(e) {
    e.preventDefault();

    try {
      await api.post("/vidros", form);

      setForm({
        nome: "",
        tipo: "",
        espessura: "",
        cor: "",
        valor_m2: "",
        observacao: "",
      });

      carregarVidros();
      alert("Vidro salvo com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar vidro.");
    }
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={page}>
      <h1>Vidros PRO Online</h1>
      <p style={{ color: "#64748b" }}>
        Cadastro técnico de vidros com valor por m² para orçamento automático.
      </p>

      <form style={card} onSubmit={salvarVidro}>
        <h2>Novo Vidro</h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            style={input}
            placeholder="Tipo: temperado, laminado..."
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          />

          <input
            style={input}
            placeholder="Espessura: 8mm, 10mm..."
            value={form.espessura}
            onChange={(e) => setForm({ ...form, espessura: e.target.value })}
          />

          <input
            style={input}
            placeholder="Cor: incolor, fumê..."
            value={form.cor}
            onChange={(e) => setForm({ ...form, cor: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Valor m²"
            value={form.valor_m2}
            onChange={(e) => setForm({ ...form, valor_m2: e.target.value })}
          />

          <input
            style={input}
            placeholder="Observação técnica"
            value={form.observacao}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          />
        </div>

        <button style={btn}>Salvar Vidro</button>
      </form>

      <div style={card}>
        <h2>Vidros cadastrados</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Nome</th>
              <th style={th}>Tipo</th>
              <th style={th}>Espessura</th>
              <th style={th}>Cor</th>
              <th style={th}>Valor m²</th>
              <th style={th}>Observação</th>
            </tr>
          </thead>

          <tbody>
            {vidros.map((v) => (
              <tr key={v.id}>
                <td style={td}>{v.nome}</td>
                <td style={td}>{v.tipo}</td>
                <td style={td}>{v.espessura}</td>
                <td style={td}>{v.cor}</td>
                <td style={td}>{dinheiro(v.valor_m2)}</td>
                <td style={td}>{v.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {vidros.length === 0 && <p>Nenhum vidro cadastrado.</p>}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: 30,
};

const card = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  marginTop: 22,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const input = {
  padding: 13,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btn = {
  marginTop: 18,
  padding: "15px 24px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 12,
  background: "#f1f5f9",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};