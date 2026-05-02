import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrcamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarOrcamento();
  }, [id]);

  async function carregarOrcamento() {
    try {
      const res = await fetch(`http://localhost:3001/orcamentos/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || "Orçamento não encontrado");
        return;
      }

      setOrcamento(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar orçamento");
    }
  }

  function dinheiro(v) {
    return Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function numero(v) {
    return Number(v || 0).toFixed(3);
  }
async function gerarOP() {
  const res = await fetch(`http://localhost:3001/orcamentos/${orcamento.id}/gerar-op`, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.erro || "Erro ao gerar OP");
    return;
  }

  alert("Ordem de produção gerada!");
  window.location.href = "/producao";
}
  function gerarListaCorte() {
    if (!orcamento) return [];

    const perfis = (orcamento.itens || []).filter((i) => i.unidade === "m");

    const agrupado = {};

    perfis.forEach((p) => {
      const nome = p.materialNome || p.material || "Perfil";
      agrupado[nome] = (agrupado[nome] || 0) + Number(p.quantidade || 0);
    });

    const barra = 6;

    const cortes = Object.entries(agrupado).map(([nome, total]) => {
      const barras = Math.ceil(total / barra);
      const sobra = barras * barra - total;

      return {
        nome,
        total,
        barras,
        sobra,
      };
    });

    console.log("LISTA DE CORTE:", cortes);

    let texto = "LISTA DE CORTE\n\n";

    cortes.forEach((c) => {
      texto += `${c.nome}\n`;
      texto += `Total: ${c.total.toFixed(3)} m\n`;
      texto += `Barras de 6m: ${c.barras}\n`;
      texto += `Sobra: ${c.sobra.toFixed(3)} m\n\n`;
    });

    alert(texto || "Nenhum perfil em metros encontrado");

    return cortes;
  }

  function gerarDesenhoFachada(doc, fachada, x, y, w, h) {
    if (!fachada) return;

    const larguraTotal = Number(fachada.larguraTotal || 3000);
    const alturaTotal = Number(fachada.alturaTotal || 3000);
    const colunas = Number(fachada.colunas || 1);
    const linhas = Number(fachada.linhas || 1);

    const larguras =
      fachada.largurasColunas || Array(colunas).fill(larguraTotal / colunas);

    const alturas =
      fachada.alturasLinhas || Array(linhas).fill(alturaTotal / linhas);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.rect(x, y, w, h);

    let xAtual = x;

    for (let c = 0; c < colunas; c++) {
      const cw = (Number(larguras[c] || 0) / larguraTotal) * w;
      let yAtual = y;

      for (let l = 0; l < linhas; l++) {
        const ch = (Number(alturas[l] || 0) / alturaTotal) * h;

        doc.setDrawColor(60, 60, 60);
        doc.rect(xAtual, yAtual, cw, ch);

        doc.setDrawColor(130, 130, 130);
        doc.rect(
          xAtual + 2,
          yAtual + 2,
          Math.max(cw - 4, 1),
          Math.max(ch - 4, 1)
        );

        yAtual += ch;
      }

      xAtual += cw;
    }

    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);

    let cotaX = x;
    larguras.forEach((larg) => {
      const cw = (Number(larg || 0) / larguraTotal) * w;

      doc.line(cotaX, y - 5, cotaX + cw, y - 5);
      doc.text(String(Math.round(larg)), cotaX + cw / 2 - 4, y - 7);

      cotaX += cw;
    });

    let cotaY = y;
    alturas.forEach((alt) => {
      const ch = (Number(alt || 0) / alturaTotal) * h;

      doc.line(x + w + 5, cotaY, x + w + 5, cotaY + ch);
      doc.text(String(Math.round(alt)), x + w + 7, cotaY + ch / 2);

      cotaY += ch;
    });

    doc.setFontSize(9);
    doc.text(`L = ${larguraTotal} mm`, x + w / 2 - 18, y - 12);
    doc.text(`H = ${alturaTotal} mm`, x + w + 10, y + h / 2);
  }

  function gerarPDF() {
    if (!orcamento) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.text("R&A Vidros e Esquadrias de Alumínio", 14, 10);

    doc.setFontSize(9);
    doc.text("Orçamento técnico profissional", 14, 18);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(11);

    doc.text(`ORÇAMENTO: #${orcamento.id}`, 14, 36);
    doc.text(`Cliente: ${orcamento.cliente || "Cliente não informado"}`, 14, 44);
    doc.text(`Obra: ${orcamento.obraNome || "Fachada"}`, 14, 52);
    doc.text(`Medidas: ${orcamento.largura} x ${orcamento.altura} mm`, 14, 60);

    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL: ${dinheiro(orcamento.valor)}`, 130, 44);

    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("Desenho técnico da fachada", 14, 72);

    gerarDesenhoFachada(doc, orcamento.desenhoFachada, 20, 82, 165, 70);

    autoTable(doc, {
      startY: 160,
      head: [["Categoria", "Material", "Unid.", "Qtd", "Unitário", "Subtotal"]],
      body: (orcamento.itens || []).map((i) => [
        i.categoria || "",
        i.materialNome || i.material || "",
        i.unidade || "",
        numero(i.quantidade),
        dinheiro(i.valorUnitario),
        dinheiro(i.subtotal),
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      body: [
        ["Custo de materiais", dinheiro(orcamento.detalhes?.custoMateriais)],
        ["Margem de lucro", dinheiro(orcamento.detalhes?.margemLucro)],
        ["Valor de venda", dinheiro(orcamento.detalhes?.valorVenda || orcamento.valor)],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "right" },
      },
    });

    const cortes = gerarListaCorte();

    if (cortes.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Perfil", "Total (m)", "Barras 6m", "Sobra (m)"]],
        body: cortes.map((c) => [
          c.nome,
          c.total.toFixed(3),
          c.barras,
          c.sobra.toFixed(3),
        ]),
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 64, 175] },
      });
    }

    doc.save(`orcamento-${orcamento.id}.pdf`);
  }

  if (erro) {
    return (
      <div>
        <h1>Orçamento</h1>
        <p style={{ color: "red" }}>{erro}</p>
        <button onClick={() => navigate("/orcamentos")}>Voltar</button>
      </div>
    );
  }

  if (!orcamento) return <h2>Carregando orçamento...</h2>;

  return (
    <div>
      <h1>Orçamento #{orcamento.id}</h1>

      <button onClick={() => navigate("/orcamentos")}>Voltar</button>

      <button
        onClick={gerarPDF}
        style={{ marginLeft: 10, background: "#0f172a", color: "#fff" }}
      >
        Gerar PDF Profissional
      </button>
<button
  onClick={gerarOP}
  style={{ marginLeft: 10, background: "#15803d", color: "#fff" }}
>
  Gerar OP Produção
</button>
      <button
        onClick={gerarListaCorte}
        style={{ marginLeft: 10, background: "#2563eb", color: "#fff" }}
      >
        Gerar Lista de Corte
      </button>

      <div style={cards}>
        <div style={card}>
          <strong>Cliente</strong>
          <p>{orcamento.cliente || "Cliente não informado"}</p>
        </div>

        <div style={card}>
          <strong>Obra</strong>
          <p>{orcamento.obraNome || "Fachada"}</p>
        </div>

        <div style={card}>
          <strong>Medidas</strong>
          <p>
            {orcamento.largura} x {orcamento.altura} mm
          </p>
        </div>

        <div style={card}>
          <strong>Total</strong>
          <h2>{dinheiro(orcamento.valor)}</h2>
        </div>
      </div>

      <h2>Resumo financeiro</h2>

      <table border="1" style={table}>
        <tbody>
          <tr>
            <td>Custo de materiais</td>
            <td>{dinheiro(orcamento.detalhes?.custoMateriais)}</td>
          </tr>
          <tr>
            <td>Margem de lucro</td>
            <td>{dinheiro(orcamento.detalhes?.margemLucro)}</td>
          </tr>
          <tr>
            <td>
              <strong>Valor de venda</strong>
            </td>
            <td>
              <strong>{dinheiro(orcamento.detalhes?.valorVenda || orcamento.valor)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Lista de materiais calculada</h2>

      <table border="1" style={table}>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Material</th>
            <th>Unidade</th>
            <th>Quantidade</th>
            <th>Valor Unit.</th>
            <th>Subtotal</th>
            <th>Origem</th>
          </tr>
        </thead>

        <tbody>
          {(orcamento.itens || []).map((item, index) => (
            <tr key={index}>
              <td>{item.categoria}</td>
              <td>{item.materialNome || item.material}</td>
              <td>{item.unidade}</td>
              <td>{numero(item.quantidade)}</td>
              <td>{dinheiro(item.valorUnitario)}</td>
              <td>{dinheiro(item.subtotal)}</td>
              <td>{item.origem || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginTop: "20px",
  marginBottom: "20px",
};

const card = {
  background: "#fff",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const table = {
  width: "100%",
  background: "#fff",
  borderCollapse: "collapse",
  marginTop: "15px",
  marginBottom: "25px",
};