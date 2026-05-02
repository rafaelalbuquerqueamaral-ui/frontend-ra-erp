import jsPDF from "jspdf";

function moeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function gerarPDFTecnico({ cliente, obra, largura, altura, quantidade, resultado }) {
  const pdf = new jsPDF("p", "mm", "a4");

  let y = 15;

  pdf.setFontSize(16);
  pdf.text("R&A VIDROS E ESQUADRIAS", 15, y);

  y += 8;
  pdf.setFontSize(10);
  pdf.text("ORÇAMENTO TÉCNICO INDUSTRIAL", 15, y);

  y += 10;
  pdf.line(15, y, 195, y);

  y += 10;
  pdf.setFontSize(11);
  pdf.text(`Cliente: ${cliente || "-"}`, 15, y);
  y += 7;
  pdf.text(`Obra: ${obra || "-"}`, 15, y);
  y += 7;
  pdf.text(`Medida: ${largura} x ${altura} mm | Qtd: ${quantidade}`, 15, y);

  y += 10;
  pdf.setFontSize(13);
  pdf.text("Resumo financeiro", 15, y);

  y += 8;
  pdf.setFontSize(10);
  pdf.text(`Alumínio: ${moeda(resultado.totalPerfis)}`, 15, y);
  y += 6;
  pdf.text(`Vidro: ${moeda(resultado.totalVidros)}`, 15, y);
  y += 6;
  pdf.text(`Acessórios: ${moeda(resultado.totalAcessorios)}`, 15, y);
  y += 6;
  pdf.text(`Subtotal: ${moeda(resultado.subtotal)}`, 15, y);
  y += 6;
  pdf.text(`Margem: ${moeda(resultado.margem)}`, 15, y);
  y += 8;

  pdf.setFontSize(14);
  pdf.text(`TOTAL: ${moeda(resultado.total)}`, 15, y);

  y += 12;
  pdf.setFontSize(13);
  pdf.text("Lista de materiais", 15, y);

  y += 8;
  pdf.setFontSize(9);

  resultado.materiais.forEach((m) => {
    if (y > 280) {
      pdf.addPage();
      y = 15;
    }

    pdf.text(
      `${m.tipo} | ${m.codigo} | ${m.nome} | ${m.medidaMM || ""} mm | ${moeda(m.valor)}`,
      15,
      y
    );

    y += 6;
  });

  pdf.save("orcamento_tecnico.pdf");
}