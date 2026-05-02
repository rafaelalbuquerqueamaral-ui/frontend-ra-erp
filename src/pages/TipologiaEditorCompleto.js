import React, { useEffect, useState } from "react";

const API = "http://localhost:3001";

const TIPOS = [
  { value: "fixo", label: "Fixo" },
  { value: "porta", label: "Porta" },
  { value: "correr", label: "Janela de Correr" },
  { value: "maxim-ar", label: "Maxim-Ar" }
];

function criarModulo(x, y, w, h, tipo = "fixo") {
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    w,
    h,
    tipo,
    children: []
  };
}

function renderLabel(tipo) {
  if (tipo === "porta") return "PORTA";
  if (tipo === "correr") return "CORRER";
  if (tipo === "maxim-ar") return "MAXIM-AR";
  return "FIXO";
}

export default function TipologiaEditorCompleto() {
  const [tipologias, setTipologias] = useState([]);
  const [tipologiaId, setTipologiaId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  const [larguraTotal, setLarguraTotal] = useState(2000);
  const [alturaTotal, setAlturaTotal] = useState(1200);

  const [modulos, setModulos] = useState([
    criarModulo(0, 0, 2000, 1200, "fixo")
  ]);

  const [selecionado, setSelecionado] = useState(null);
  const [tipoAtual, setTipoAtual] = useState("fixo");

  useEffect(() => {
    carregarTipologias();
  }, []);

  async function carregarTipologias() {
    const res = await fetch(`${API}/tipologias`);
    const data = await res.json();
    setTipologias(Array.isArray(data) ? data : []);
  }

  async function carregarTipologia(id) {
    if (!id) return;

    const res = await fetch(`${API}/tipologias/${id}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao carregar tipologia");
      return;
    }

    setTipologiaId(data.id);
    setNome(data.nome || "");
    setDescricao(data.descricao || "");
    setPrecoBase(data.preco_base || "");
    setImagemUrl(data.imagem_url || "");

    if (data.desenho_json) {
      setLarguraTotal(data.desenho_json.larguraTotal || 2000);
      setAlturaTotal(data.desenho_json.alturaTotal || 1200);
      setModulos(
        Array.isArray(data.desenho_json.modulos) && data.desenho_json.modulos.length > 0
          ? data.desenho_json.modulos
          : [criarModulo(0, 0, 2000, 1200, "fixo")]
      );
    } else {
      setLarguraTotal(2000);
      setAlturaTotal(1200);
      setModulos([criarModulo(0, 0, 2000, 1200, "fixo")]);
    }
  }

  async function salvarTipologia() {
    const payload = {
      nome,
      descricao,
      preco_base: Number(precoBase || 0),
      imagem_url: imagemUrl,
      desenho_json: {
        larguraTotal,
        alturaTotal,
        modulos
      }
    };

    let res;
    if (tipologiaId) {
      res = await fetch(`${API}/tipologias/${tipologiaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API}/tipologias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao salvar tipologia");
      return;
    }

    alert("Tipologia salva com sucesso");
    setTipologiaId(data.id);
    carregarTipologias();
  }

  function atualizarModulo(lista, id, callback) {
    return lista.map((m) => {
      if (m.id === id) {
        return callback(m);
      }

      if (m.children && m.children.length > 0) {
        return {
          ...m,
          children: atualizarModulo(m.children, id, callback)
        };
      }

      return m;
    });
  }

  function aplicarTipo() {
    if (!selecionado) {
      alert("Selecione um módulo");
      return;
    }

    setModulos((prev) =>
      atualizarModulo(prev, selecionado, (m) => ({
        ...m,
        tipo: tipoAtual
      }))
    );
  }

  function dividirVertical() {
    if (!selecionado) {
      alert("Selecione um módulo");
      return;
    }

    setModulos((prev) =>
      atualizarModulo(prev, selecionado, (m) => {
        const metade = m.w / 2;
        return {
          ...m,
          tipo: "container",
          children: [
            criarModulo(m.x, m.y, metade, m.h, "fixo"),
            criarModulo(m.x + metade, m.y, metade, m.h, "fixo")
          ]
        };
      })
    );
  }

  function dividirHorizontal() {
    if (!selecionado) {
      alert("Selecione um módulo");
      return;
    }

    setModulos((prev) =>
      atualizarModulo(prev, selecionado, (m) => {
        const metade = m.h / 2;
        return {
          ...m,
          tipo: "container",
          children: [
            criarModulo(m.x, m.y, m.w, metade, "fixo"),
            criarModulo(m.x, m.y + metade, m.w, metade, "fixo")
          ]
        };
      })
    );
  }

  function limparDivisao() {
    if (!selecionado) {
      alert("Selecione um módulo");
      return;
    }

    setModulos((prev) =>
      atualizarModulo(prev, selecionado, (m) => ({
        ...m,
        tipo: "fixo",
        children: []
      }))
    );
  }

  function novoDesenho() {
    setTipologiaId("");
    setNome("");
    setDescricao("");
    setPrecoBase("");
    setImagemUrl("");
    setLarguraTotal(2000);
    setAlturaTotal(1200);
    setModulos([criarModulo(0, 0, 2000, 1200, "fixo")]);
    setSelecionado(null);
  }

  function renderModulo(m, escala = 0.22) {
    const temFilhos = m.children && m.children.length > 0;

    return (
      <div
        key={m.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelecionado(m.id);
        }}
        style={{
          position: "absolute",
          left: m.x * escala,
          top: m.y * escala,
          width: m.w * escala,
          height: m.h * escala,
          border: selecionado === m.id ? "3px solid #16a34a" : "2px solid #334155",
          background:
            m.tipo === "porta"
              ? "#dbeafe"
              : m.tipo === "correr"
              ? "#dcfce7"
              : m.tipo === "maxim-ar"
              ? "#fef3c7"
              : "#f8fafc",
          boxSizing: "border-box",
          overflow: "hidden",
          cursor: "pointer"
        }}
      >
        {!temFilhos && (
          <div
            style={{
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 8,
              color: "#0f172a"
            }}
          >
            {renderLabel(m.tipo)}
          </div>
        )}

        {!temFilhos && (
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 4,
              fontSize: 10,
              color: "#475569"
            }}
          >
            {Math.round(m.w)} x {Math.round(m.h)}
          </div>
        )}

        {temFilhos &&
          m.children.map((child) => renderModulo(child, escala))}
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Editor Visual de Tipologia</h1>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={box}>
          <h2>Cadastro</h2>

          <select
            value={tipologiaId}
            onChange={(e) => carregarTipologia(e.target.value)}
            style={input}
          >
            <option value="">Selecionar tipologia</option>
            {tipologias.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>

          <input
            placeholder="Nome da tipologia"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={input}
          />

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={input}
          />

          <input
            type="number"
            placeholder="Preço base"
            value={precoBase}
            onChange={(e) => setPrecoBase(e.target.value)}
            style={input}
          />

          <input
            placeholder="Imagem URL (opcional)"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            style={input}
          />

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

          <button onClick={salvarTipologia} style={button}>
            Salvar Tipologia
          </button>

          <button onClick={novoDesenho} style={buttonSecondary}>
            Nova Tipologia
          </button>
        </div>

        <div>
          <div style={box}>
            <h2>Ferramentas</h2>

            <select
              value={tipoAtual}
              onChange={(e) => setTipoAtual(e.target.value)}
              style={input}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={aplicarTipo} style={button}>
                Aplicar Tipo
              </button>

              <button onClick={dividirVertical} style={button}>
                Dividir Vertical
              </button>

              <button onClick={dividirHorizontal} style={button}>
                Dividir Horizontal
              </button>

              <button onClick={limparDivisao} style={buttonDanger}>
                Limpar Divisão
              </button>
            </div>
          </div>

          <div style={box}>
            <h2>Desenho da Tipologia</h2>

            {imagemUrl && (
              <div style={{ marginBottom: 15 }}>
                <img
                  src={imagemUrl}
                  alt="Tipologia"
                  style={{
                    maxWidth: 220,
                    border: "1px solid #ccc",
                    borderRadius: 8
                  }}
                />
              </div>
            )}

            <div
              style={{
                position: "relative",
                width: larguraTotal * 0.22,
                height: alturaTotal * 0.22,
                border: "3px solid #0f172a",
                background: "#ffffff"
              }}
            >
              {modulos.map((m) => renderModulo(m))}
            </div>
          </div>
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
  cursor: "pointer"
};

const buttonSecondary = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#475569",
  color: "#fff",
  cursor: "pointer",
  marginTop: 10
};

const buttonDanger = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#b91c1c",
  color: "#fff",
  cursor: "pointer"
};