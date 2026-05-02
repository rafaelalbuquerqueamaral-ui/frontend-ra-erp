import jsPDF from "jspdf";

export function gerarPdfOrcamentoPremium({
  cliente,
  tipologia,
  largura,
  altura,
  quantidade,
}) {
  const doc = new jsPDF("p", "mm", "a4");

  const moeda = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const nomeCliente =
    typeof cliente === "object" ? cliente?.nome || "Cliente" : cliente || "Cliente";

  const nomeTipologia =
    typeof tipologia === "object" ? tipologia?.nome || "Tipologia" : tipologia || "Tipologia";

  const linhaTipologia =
    typeof tipologia === "object" ? tipologia?.linha || "-" : "-";

  const larguraFinal = Number(largura || 0);
  const alturaFinal = Number(altura || 0);
  const quantidadeFinal = Number(quantidade || 1);

  const total = larguraFinal * alturaFinal * quantidadeFinal;

  // Cabeçalho
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("R&A VIDROS E ESQUADRIAS", 14, 16);

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("PROPOSTA COMERCIAL", 14, 25);

  doc.setTextColor(0, 0, 0);

  let y = 50;

  // Cliente
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Dados do Cliente", 14, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Cliente: ${nomeCliente}`, 14, y);

  y += 12;

  // Produto
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Produto", 14, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Tipologia: ${nomeTipologia}`, 14, y);
  y += 7;
  doc.text(`Linha: ${linhaTipologia}`, 14, y);
  y += 7;
  doc.text(`Largura: ${larguraFinal}`, 14, y);
  y += 7;
  doc.text(`Altura: ${alturaFinal}`, 14, y);
  y += 7;
  doc.text(`Quantidade: ${quantidadeFinal}`, 14, y);

  y += 15;

  // Bloco total
  doc.setFillColor(6, 95, 70);
  doc.roundedRect(14, y, 182, 22, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`TOTAL: ${moeda(total)}`, 105, y + 14, { align: "center" });

  doc.setTextColor(0, 0, 0);

  y += 40;

  // Rodapé
  doc.setDrawColor(180, 180, 180);
  doc.line(14, y, 80, y);
  doc.line(120, y, 196, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Assinatura do Cliente", 14, y + 6);
  doc.text("Responsável Comercial", 120, y + 6);

  doc.save(`PROPOSTA_${String(nomeTipologia).replace(/\s+/g, "_")}.pdf`);
}