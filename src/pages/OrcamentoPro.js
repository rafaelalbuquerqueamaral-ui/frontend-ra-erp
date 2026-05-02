import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrcamentoPro() {
  const [tipologias, setTipologias] = useState([]);
  const [resultado, setResultado] = useState(null);

  const [form, setForm] = useState({
    tipologia_id: "",
    largura: "",
    altura: "",
  });

  useEffect(() => {
    carregarTipologias();
  }, []);

  async function carregarTipologias() {
    try {
      const res = await api.get("/tipologias");
      setTipologias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setTipologias([]);
    }
  }

  function selecionarTipologia(id) {
    const tip = tipologias.find((t) => Number(t.id) === Number(id));

    setForm({
      tipologia_id: id,
      largura: tip?.largura_padrao || "",
      altura: tip?.altura_padrao || "",
    });

    setResultado(null);
  }

  async function calcular(e) {
    e.preventDefault();

    const tip = tipologias.find(
      (t) => Number(t.id) === Number(form.tipologia_id)
    );

    if (!tip) {
      alert("Selecione uma tipologia.");
      return;
    }

    const largura = Number(form.largura || 0);
    const altura = Number(form.altura || 0);
    const area = (largura * altura) / 1000000;

    const valorVidroM2 = Number(tip.valor_vidro_m2 || 180);
    const valorPerfilM = Number(tip.valor_perfil_m || 95);
    const valorAcessorios = Number(tip.valor_acessorios || 80);
    const margem = 1.35;

    const perimetro = ((largura * 2) + (altura * 2)) / 1000;

    const totalVidro = area * valorVidroM2;
    const totalPerfis = perimetro * valorPerfilM;
    const custoTotal = totalVidro + totalPerfis + valorAcessorios;
    const vendaTotal = custoTotal * margem;

    setResultado({
      tipologia: tip.nome,
      linha: tip.linha,
      largura,
      altura,
      area,
      perimetro,
      vidro: tip.vidro || "Vidro padrão",
      perfil: tip.perfil || "Perfil padrão",
      acessorios: tip.acessorios || "Acessórios padrão",
      totalVidro,
      totalPerfis,
      totalAcessorios: valorAcessorios,
      custoTotal,
      vendaTotal,
      imagem: tip.imagem,
      observacao: tip.observacao_tecnica,
    });
  }

  async function salvarOrcamento() {
    if (!resultado) {
      alert("Calcule antes de salvar.");
      return;
    }

    try {
      await api.post("/orcamentos", {
        cliente: "Cliente não informado",
        tipologia: resultado.tipologia,
        largura: resultado.largura,
        altura: resultado.altura,
        valor_total: resultado.vendaTotal,
      });

      alert("Orçamento salvo online!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar orçamento.");
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
      <h1>Orçamento Automático REAL</h1>
      <p style={{ color: "#64748b" }}>
        Puxa tipologia, vidro, perfil, acessórios e calcula automaticamente.
      </p>

      <form style={card} onSubmit={calcular}>
        <h2>Novo Orçamento</h2>

        <div style={grid}>
          <select
            style={input}
            value={form.tipologia_id}
            onChange={(e) => selecionarTipologia(e.target.value)}
          >
            <option value="">Selecione a tipologia</option>
            {tipologias.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} - {t.linha}
              </option>
            ))}
          </select>

          <input
            style={input}
            type="number"
            placeholder="Largura mm"
            value={form.largura}
            onChange={(e) => setForm({ ...form, largura: e.target.value })}
          />

          <input
            style={input}
            type="number"
            placeholder="Altura mm"
            value={form.altura}
            onChange={(e) => setForm({ ...form, altura: e.target.value })}
          />

          <button style={btn}>Calcular</button>
        </div>
      </form>

      {resultado && (
        <>
          <div style={resumo}>
            <Card titulo="Área" valor={`${resultado.area.toFixed(2)} m²`} />
            <Card titulo="Vidro" valor={dinheiro(resultado.totalVidro)} />
            <Card titulo="Perfis" valor={dinheiro(resultado.totalPerfis)} />
            <Card
              titulo="Acessórios"
              valor={dinheiro(resultado.totalAcessorios)}
            />
            <Card
              titulo="Venda Final"
              valor={dinheiro(resultado.vendaTotal)}
              destaque
            />
          </div>

          <div style={card}>
            <h2>Memória Técnica</h2>

            <div style={memoriaGrid}>
              {resultado.imagem && (
                <img
                  src={`https://backend-esquadrias.onrender.com${resultado.imagem}`}
                  alt=""
                  style={img}
                />
              )}

              <div>
                <p><b>Tipologia:</b> {resultado.tipologia}</p>
                <p><b>Linha:</b> {resultado.linha}</p>
                <p><b>Medidas:</b> {resultado.largura} x {resultado.altura} mm</p>
                <p><b>Perímetro:</b> {resultado.perimetro.toFixed(2)} m</p>
                <p><b>Vidro:</b> {resultado.vidro}</p>
                <p><b>Perfil:</b> {resultado.perfil}</p>
                <p><b>Acessórios:</b> {resultado.acessorios}</p>
                <p><b>Obs:</b> {resultado.observacao}</p>
              </div>
            </div>
          </div>

          <div style={card}>
            <h2>Resumo de Custos</h2>

            <table style={table}>
              <tbody>
                <tr>
                  <td style={td}>Vidro</td>
                  <td style={td}>{dinheiro(resultado.totalVidro)}</td>
                </tr>
                <tr>
                  <td style={td}>Perfis</td>
                  <td style={td}>{dinheiro(resultado.totalPerfis)}</td>
                </tr>
                <tr>
                  <td style={td}>Acessórios</td>
                  <td style={td}>{dinheiro(resultado.totalAcessorios)}</td>
                </tr>
                <tr>
                  <td style={td}><b>Custo Total</b></td>
                  <td style={td}><b>{dinheiro(resultado.custoTotal)}</b></td>
                </tr>
                <tr>
                  <td style={td}><b>Venda Final</b></td>
                  <td style={td}><b>{dinheiro(resultado.vendaTotal)}</b></td>
                </tr>
              </tbody>
            </table>

            <button style={btn} onClick={salvarOrcamento}>
              Salvar Orçamento Online
            </button>

            <button style={btnBlue} onClick={() => window.print()}>
              Gerar PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ titulo, valor, destaque }) {
  return (
    <div style={destaque ? cardDark : cardResumo}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
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
  gridTemplateColumns: "2fr 1fr 1fr 1fr",
  gap: 12,
};

const input = {
  padding: 13,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
};

const btn = {
  padding: "13px 22px",
  border: "none",
  borderRadius: 12,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const btnBlue = {
  ...btn,
  background: "#2563eb",
  marginLeft: 10,
};

const resumo = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 15,
  marginTop: 22,
};

const cardResumo = {
  background: "white",
  borderRadius: 18,
  padding: 20,
  display: "grid",
  gap: 8,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const cardDark = {
  ...cardResumo,
  background: "#0f172a",
  color: "white",
};

const memoriaGrid = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: 20,
};

const img = {
  width: 260,
  height: 170,
  objectFit: "cover",
  borderRadius: 14,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
};