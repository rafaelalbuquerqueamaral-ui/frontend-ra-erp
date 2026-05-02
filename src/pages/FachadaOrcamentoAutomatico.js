import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

function criarModulo(x, y, w, h) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    x,
    y,
    w,
    h,
    tipo: "modulo",
    tipologia_id: "",
    children: []
  };
}

export default function FachadaOrcamentoAutomatico() {
  const [clientes, setClientes] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [fachadas, setFachadas] = useState([]);

  const [fachadaId, setFachadaId] = useState("");
  const [nome, setNome] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [larguraTotal, setLarguraTotal] = useState(6000);
  const [alturaTotal, setAlturaTotal] = useState(3000);

  const [linhas, setLinhas] = useState(2);
  const [colunas, setColunas] = useState(3);

  const [modulos, setModulos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    carregarBases();
  }, []);

  async function carregarBases() {
    const [c, t, f] = await Promise.all([
      fetch(`${API}/clientes`),
      fetch(`${API}/tipologias`),
      fetch(`${API}/fachadas`)
    ]);

    setClientes(await c.json());
    setTipologias(await t.json());
    setFachadas(await f.json());
  }

  function gerarGrade() {
    const larguraModulo = larguraTotal / colunas;
    const alturaModulo = alturaTotal / linhas;

    const novos = [];

    for (let l = 0; l < linhas; l++) {
      for (let c = 0; c < colunas; c++) {
        novos.push(
          criarModulo(
            c * larguraModulo,
            l * alturaModulo,
            larguraModulo,
            alturaModulo
          )
        );
      }
    }

    setModulos(novos);
    setSelecionado(null);
  }

  function aplicarTipologiaNoModulo(tipologia_id) {
    if (!selecionado) {
      alert("Selecione um módulo");
      return;
    }

    setModulos((prev) =>
      prev.map((m) =>
        m.id === selecionado
          ? { ...m, tipologia_id }
          : m
      )
    );
  }

  async function salvarFachada() {
    const payload = {
      nome,
      cliente_id: clienteId || null,
      largura_total_mm: larguraTotal,
      altura_total_mm: alturaTotal,
      desenho_json: {
        larguraTotal,
        alturaTotal,
        modulos
      }
    };

    let res;

    if (fachadaId) {
      res = await fetch(`${API}/fachadas/${fachadaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API}/fachadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar fachada");
      return;
    }

    alert("Fachada salva com sucesso");
    setFachadaId(data.id);
    carregarBases();
  }

  async function carregarFachada(id) {
    const res = await fetch(`${API}/fachadas/${id}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao carregar fachada");
      return;
    }

    setFachadaId(data.id);
    setNome(data.nome || "");
    setClienteId(data.cliente_id || "");
    setLarguraTotal(Number(data.largura_total_mm || 6000));
    setAlturaTotal(Number(data.altura_total_mm || 3000));
    setModulos(data.desenho_json?.modulos || []);
    setResultado(null);
  }

  async function gerarOrcamentoAutomatico() {
    if (!fachadaId) {
      alert("Salve a fachada antes de gerar o orçamento");
      return;
    }

    const res = await fetch(`${API}/fachadas/${fachadaId}/gerar-orcamento`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar orçamento da fachada");
      return;
    }

    setResultado(data);
    alert("Orçamento da fachada gerado com sucesso");
    carregarBases();
  }

  function nomeTipologia(id) {
    const tip = tipologias.find((t) => String(t.id) === String(id));
    return tip ? tip.nome : "Sem tipologia";
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Fachada Completa → Orçamento Automático</h1>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={box}>
          <h2>Cadastro da Fachada</h2>

          <select
            value={fachadaId}
            onChange={(e) => carregarFachada(e.target.value)}
            style={input}
          >
            <option value="">Selecionar fachada</option>
            {fachadas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>

          <input
            placeholder="Nome da fachada"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={input}
          />

          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            style={input}
          >
            <option value="">Cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Largura total"
            value={larguraTotal}
            onChange={(e) => setLarguraTotal(Number(e.target.value))}
            style={input}
          />

          <input
            type="number"
            placeholder="Altura total"
            value={alturaTotal}
            onChange={(e) => setAlturaTotal(Number(e.target.value))}
            style={input}
          />

          <input
            type="number"
            placeholder="Linhas"
            value={linhas}
            onChange={(e) => setLinhas(Number(e.target.value))}
            style={input}
          />

          <input
            type="number"
            placeholder="Colunas"
            value={colunas}
            onChange={(e) => setColunas(Number(e.target.value))}
            style={input}
          />

          <button onClick={gerarGrade} style={button}>
            Gerar Grade da Fachada
          </button>

          <button onClick={salvarFachada} style={buttonSecondary}>
            Salvar Fachada
          </button>

          <button onClick={gerarOrcamentoAutomatico} style={buttonSuccess}>
            Gerar Orçamento Automático
          </button>
        </div>

        <div>
          <div style={box}>
            <h2>Atribuir Tipologia ao Módulo</h2>

            <select
              onChange={(e) => aplicarTipologiaNoModulo(e.target.value)}
              style={input}
            >
              <option value="">Selecione a tipologia</option>
              {tipologias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>

            <div
              style={{
                position: "relative",
                width: larguraTotal * 0.12,
                height: alturaTotal * 0.12,
                border: "3px solid #0f172a",
                background: "#fff"
              }}
            >
              {modulos.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelecionado(m.id)}
                  style={{
                    position: "absolute",
                    left: m.x * 0.12,
                    top: m.y * 0.12,
                    width: m.w * 0.12,
                    height: m.h * 0.12,
                    border: selecionado === m.id ? "3px solid #16a34a" : "2px solid #334155",
                    background: m.tipologia_id ? "#dcfce7" : "#f8fafc",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ fontSize: 11, textAlign: "center", marginTop: 8 }}>
                    {nomeTipologia(m.tipologia_id)}
                  </div>
                  <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 10 }}>
                    {Math.round(m.w)} x {Math.round(m.h)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {resultado && (
            <div style={box}>
              <h2>Resultado do Orçamento Automático</h2>

              <div>
                <strong>Total da Fachada:</strong> R$ {Number(resultado.total).toFixed(2)}
              </div>

              <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: 15 }}>
                <thead>
                  <tr>
                    <th>Módulo</th>
                    <th>Descrição</th>
                    <th>Largura</th>
                    <th>Altura</th>
                    <th>Área</th>
                    <th>Preço Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.itens.map((item) => (
                    <tr key={item.id}>
                      <td>{item.modulo_id}</td>
                      <td>{item.descricao}</td>
                      <td>{item.largura_mm} mm</td>
                      <td>{item.altura_mm} mm</td>
                      <td>{Number(item.area).toFixed(2)} m²</td>
                      <td>R$ {Number(item.preco_unit).toFixed(2)}</td>
                      <td>R$ {Number(item.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const box = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  marginBottom: 20
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
  marginRight: 10,
  marginBottom: 10
};

const buttonSecondary = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#475569",
  color: "#fff",
  cursor: "pointer",
  marginRight: 10,
  marginBottom: 10
};

const buttonSuccess = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#166534",
  color: "#fff",
  cursor: "pointer",
  marginBottom: 10
};