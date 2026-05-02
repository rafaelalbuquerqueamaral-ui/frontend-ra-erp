import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function OrcamentosPage() {
  const [clientes, setClientes] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);

  const [form, setForm] = useState({
    cliente_id: "",
    tipologia_id: "",
    largura: "",
    altura: "",
    quantidade: 1
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const [c, t, o] = await Promise.all([
      fetch(`${API}/clientes`).then((r) => r.json()),
      fetch(`${API}/tipologias`).then((r) => r.json()),
      fetch(`${API}/orcamentos`).then((r) => r.json())
    ]);

    setClientes(Array.isArray(c) ? c : []);
    setTipologias(Array.isArray(t) ? t : []);
    setOrcamentos(Array.isArray(o) ? o : []);
  }

  async function salvar(e) {
    e.preventDefault();

    const res = await fetch(`${API}/orcamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar orçamento");
      return;
    }

    setForm({
      cliente_id: "",
      tipologia_id: "",
      largura: "",
      altura: "",
      quantidade: 1
    });

    carregar();
  }

  const tipologiaSelecionada = tipologias.find(
    (t) => String(t.id) === String(form.tipologia_id)
  );

  const area = (Number(form.largura || 0) / 1000) * (Number(form.altura || 0) / 1000);
  const totalPreview =
    area * Number(tipologiaSelecionada?.preco_base || 0) * Number(form.quantidade || 1);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Orçamentos</h1>

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Novo Orçamento</h2>

          <form onSubmit={salvar}>
            <select
              style={input}
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            >
              <option value="">Cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select
              style={input}
              value={form.tipologia_id}
              onChange={(e) => setForm({ ...form, tipologia_id: e.target.value })}
            >
              <option value="">Tipologia</option>
              {tipologias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>

            {tipologiaSelecionada && (
              <div style={{ marginBottom: 12 }}>
                {tipologiaSelecionada.imagem_url ? (
                  <img
                    src={tipologiaSelecionada.imagem_url}
                    alt={tipologiaSelecionada.nome}
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#fff"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 180,
                      background: "#e5e7eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    Sem imagem da tipologia
                  </div>
                )}
              </div>
            )}

            <input
              style={input}
              placeholder="Largura mm"
              type="number"
              value={form.largura}
              onChange={(e) => setForm({ ...form, largura: e.target.value })}
            />

            <input
              style={input}
              placeholder="Altura mm"
              type="number"
              value={form.altura}
              onChange={(e) => setForm({ ...form, altura: e.target.value })}
            />

            <input
              style={input}
              placeholder="Quantidade"
              type="number"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            />

            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 12 }}>
              <div><strong>Tipologia:</strong> {tipologiaSelecionada?.nome || "-"}</div>
              <div><strong>Área:</strong> {area.toFixed(2)} m²</div>
              <div><strong>Total:</strong> R$ {totalPreview.toFixed(2)}</div>
            </div>

            <button style={button} type="submit">
              Salvar Orçamento
            </button>
          </form>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Lista de Orçamentos</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Tipologia</Th>
                <Th>Largura</Th>
                <Th>Altura</Th>
                <Th>Qtd</Th>
                <Th>Total</Th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((o) => (
                <tr key={o.id}>
                  <Td>{o.id}</Td>
                  <Td>{o.cliente_nome}</Td>
                  <Td>{o.tipologia_nome}</Td>
                  <Td>{o.largura}</Td>
                  <Td>{o.altura}</Td>
                  <Td>{o.quantidade}</Td>
                  <Td>R$ {Number(o.total || 0).toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const box = {
  background: "#fff",
  borderRadius: 12,
  padding: 16
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  boxSizing: "border-box",
  borderRadius: 6,
  border: "1px solid #ccc"
};

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};

function Th({ children }) {
  return <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{children}</td>;
}