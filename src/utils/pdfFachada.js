import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function moeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function gerarPDFDaFachada({
  titulo = "Elevação Técnica",
  cliente = "",
  largura,
  altura,
  qtdX,
  qtdY,
  desenhoRef,
  materiais = [],
  total = 0,
  logoSrc = null,
}) {
  const pdf = new jsPDF("p", "mm", "a4");

  // ===== Cabeçalho =====
  if (logoSrc) {
    try {
      pdf.addImage(logoSrc, "PNG", 10, 8, 30, 15);
    } catch {}
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(titulo, 105, 15, { align: "center" });

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Cliente: ${cliente}`, 10, 25);
  pdf.text(`Dimensão: ${largura} x ${altura} mm`, 10, 30);
  pdf.text(`Módulos: ${qtdX} x ${qtdY}`, 10, 35);

  let y = 45;

  // ===== Desenho CAD =====
  if (desenhoRef?.current) {
    const canvas = await html2canvas(desenhoRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 180;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 15, y, imgWidth, imgHeight);

    // ===== COTAS =====
    pdf.setDrawColor(0);

    // largura total
    pdf.line(15, y + imgHeight + 5, 195, y + imgHeight + 5);
    pdf.text(`${largura} mm`, 105, y + imgHeight + 10, { align: "center" });

    // altura total
    pdf.line(10, y, 10, y + imgHeight);
    pdf.text(`${altura} mm`, 5, y + imgHeight / 2, { angle: 90 });

    // módulos horizontais
    const modL = largura / qtdX;
    for (let i = 1; i < qtdX; i++) {
      const posX = 15 + (imgWidth / qtdX) * i;
      pdf.line(posX, y, posX, y + imgHeight);
      pdf.text(`${modL.toFixed(0)}`, posX - 5, y - 2);
    }

    // módulos verticais
    const modH = altura / qtdY;
    for (let i = 1; i < qtdY; i++) {
      const posY = y + (imgHeight / qtdY) * i;
      pdf.line(15, posY, 15 + imgWidth, posY);
      pdf.text(`${modH.toFixed(0)}`, 2, posY);
    }

    y += imgHeight + 20;
  }

  // ===== Lista de materiais =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Materiais", 15, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  materiais.forEach((m) => {
    pdf.text(
      `${m.nome} — ${m.qtd?.toFixed?.(2) || m.qtd} ${m.unidade || ""} — ${moeda(m.valor)}`,
      15,
      y
    );
    y += 5;

    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
  });

  y += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text(`TOTAL: ${moeda(total)}`, 15, y);

  pdf.save("elevacao_tecnica.pdf");
}