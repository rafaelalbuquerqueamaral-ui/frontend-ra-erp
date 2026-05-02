import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const gerarPDF = async (orcamento) => {
  const elemento = document.getElementById("pdf-area");

  const canvas = await html2canvas(elemento, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const largura = 210;
  const altura = (canvas.height * largura) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, largura, altura);

  pdf.save(`orcamento_${orcamento.id}.pdf`);
};