import { useMemo, useState } from "react";

export default function ListaCorte() {
  const [barraPadrao, setBarraPadrao] = useState(6000);
  const [perdaSerra, setPerdaSerra] = useState(3);

  const materiais = JSON.parse(localStorage.getItem("materiais_corte") || "[]");
  const listaSalva = JSON.parse(localStorage.getItem("lista_corte") || "[]");

  const barras = useMemo(() => {
    if (listaSalva.length > 0) return listaSalva;

    const pecas = materiais
      .filter((m) => m.tipo === "PERFIL")
      .map((m, i) => ({
        codigo: m.codigo || "PERFIL",
        nome: m.nome || "Perfil",
        medida: Number(m.medida || m.qtd * 1000 || 0),
        qtd: Number(m.quantidade || 1),
        id: i,
      }))
      .flatMap((p) =>
        Array.from({ length: p.qtd }, (_, i) => ({
          ...p,
          id: `${p.id}-${i}`,
        }))
      )
      .sort((a, b) => b.medida - a.medida);

    return otimizar(pecas, Number(barraPadrao), Number(perdaSerra));
  }, [materiais, listaSalva, barraPadrao, perdaSerra]);

  function otimizar(pecas, tamanhoBarra, serra) {
    const resultado = [];

    pecas.forEach((peca) => {
      let encaixou = false;

      for (const barra of resultado) {
        const novoUsado = barra.usado + peca.medida + serra;

        if (novoUsado <= tamanhoBarra) {
          barra.pecas.push(peca);
          barra.usado = novoUsado;
          barra.sobra = tamanhoBarra - novoUsado;
          encaixou = true;
          break;
        }
      }

      if (!encaixou) {
        resultado.push({
          usado: peca.medida,
          sobra: tamanhoBarra - peca.medida,
          pecas: [peca],
        });
      }
    });

    return resultado;
  }

  const totalUsado = barras.reduce((s, b) => s + Number(b.usado || 0), 0);
  const totalSobra = barras.reduce((s, b) => s + Number(b.sobra || 0), 0);
  const totalBarras = barras.length;

  function limpar() {
    localStorage.removeItem("materiais_corte");
    localStorage.removeItem("lista_corte");
    window.location.reload();
  }

  return (
    <div style={page}>
      <div style={topo}>
        <div>
          <h1>Lista de Corte Industrial</h1>
          <p>Otimização de barras com perda de serra</p>
        </div>

        <button style={btnVermelho} onClick={limpar}>
          Limpar Corte
        </button>
      </div>

      <div style={cards}>
        <Card titulo="Barras" valor={totalBarras} />
        <Card titulo="Usado" valor={`${totalUsado.toFixed(0)} mm`} />
        <Card titulo="Sobra" valor={`${totalSobra.toFixed(0)} mm`} />
      </div>

      <section style={card}>
        <h2>Configuração</h2>

        <div style={linha}>
          <label>
            Barra padrão mm
            <input
              style={input}
              value={barraPadrao}
              onChange={(e) => setBarraPadrao(e.target.value)}
            />
          </label>

          <label>
            Perda de serra mm
            <input
              style={input}
              value={perdaSerra}
              onChange={(e) => setPerdaSerra(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section style={card}>
        <h2>Barras Otimizadas</h2>

        {barras.length === 0 && (
          <p>Nenhum material enviado para corte ainda.</p>
        )}

        {barras.map((barra, index) => (
          <div key={index} style={barraBox}>
            <h3>
              Barra {index + 1} — Usado: {barra.usado} mm — Sobra:{" "}
              {barra.sobra} mm
            </h3>

            <div style={visualBarra}>
              {barra.pecas.map((p, i) => (
                <div
                  key={i}
                  style={{
                    ...pecaVisual,
                    flex: Math.max(Number(p.medida || 0), 100),
                  }}
                  title={`${p.nome} - ${p.medida} mm`}
                >
                  {p.medida} mm
                </div>
              ))}
            </div>

            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Código</th>
                  <th style={th}>Perfil</th>
                  <th style={th}>Medida</th>
                </tr>
              </thead>

              <tbody>
                {barra.pecas.map((p, i) => (
                  <tr key={i}>
                    <td style={td}>{p.codigo}</td>
                    <td style={td}>{p.nome}</td>
                    <td style={td}>{p.medida} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div style={cardResumo}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

const page = { fontFamily: "Arial" };

const topo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
  marginBottom: 20,
};

const cardResumo = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const card = {
  background: "#fff",
  padding: 22,
  borderRadius: 18,
  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
  marginBottom: 20,
};

const linha = {
  display: "grid",
  gridTemplateColumns: "220px 220px",
  gap: 14,
};

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  marginTop: 6,
};

const barraBox = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
};

const visualBarra = {
  display: "flex",
  width: "100%",
  height: 42,
  border: "2px solid #0f172a",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 14,
};

const pecaVisual = {
  background: "#dbeafe",
  borderRight: "2px solid #0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: "bold",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  background: "#e2e8f0",
  border: "1px solid #cbd5e1",
  padding: 10,
  textAlign: "left",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 10,
};

const btnVermelho = {
  padding: "12px 18px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
};