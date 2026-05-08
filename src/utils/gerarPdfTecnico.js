import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function gerarPdfTecnico() {
  const doc = new jsPDF("p", "mm", "a4");

  const itens = [
    {
      item: "J1",
      descricao: "JANELA DE CORRER 2 FOLHAS MÓVEIS - LINHA SUPREMA",
      largura: "1570 x 1180",
      vidro: "6MM INCOLOR TEMPERADO",
      cor: "PINTADO BRANCO",
      qtde: 1,
      unitario: "1.895,00",
      total: "1.895,00",
      desenho: "⇄",
    },

    {
      item: "J2",
      descricao: "JANELA DE CORRER 2 FOLHAS MÓVEIS - LINHA SUPREMA",
      largura: "1370 x 1180",
      vidro: "6MM INCOLOR TEMPERADO",
      cor: "PINTADO BRANCO",
      qtde: 1,
      unitario: "1.740,00",
      total: "1.740,00",
      desenho: "⇄",
    },

    {
      item: "J3",
      descricao: "JANELA MAXIM-AR 1 MÓDULO - LINHA SUPREMA",
      largura: "580 x 810",
      vidro: "3MM MINI BOREAL",
      cor: "PINTADO BRANCO",
      qtde: 1,
      unitario: "632,00",
      total: "632,00",
      desenho: "▽",
    },
  ];

  /* FUNDO */

  doc.setFillColor(228, 235, 208);
  doc.rect(10, 10, 40, 28, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("R&A VIDROS", 18, 18);

  desenharLogo(doc, 16, 20);

  /* CABEÇALHO */

  doc.setDrawColor(120);
  doc.rect(50, 10, 150, 28);

  doc.setFontSize(18);
  doc.text("R&A Vidros e Esquadrias de Alumínio", 80, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("RUA ISMAEL JOÃO DA SILVA 654 - FLORIANÓPOLIS - SC", 72, 24);
  doc.text("RAFAEL.ALBUQUERQUE.AMARAL@GMAIL.COM", 76, 29);
  doc.text("(48)99687-8136", 103, 34);

  doc.setFont("helvetica", "bold");
  doc.text("ORÇAMENTO:", 52, 44);
  doc.text("PROP-9087", 85, 44);

  doc.text("Data de Emissão:", 145, 44);
  doc.text("03/05/2026", 182, 44);

  /* CLIENTE */

  doc.setFontSize(11);

  doc.text("Cliente:", 12, 56);
  doc.setFont("helvetica", "normal");
  doc.text("PAULO", 34, 56);

  doc.setFont("helvetica", "bold");
  doc.text("Telefone:", 12, 63);

  doc.text("Email:", 12, 70);

  doc.text("Endereço:", 12, 77);

  /* TÍTULO */

  doc.setFillColor(228, 235, 208);
  doc.rect(10, 84, 190, 7, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Composição do Orçamento", 12, 89);

  let y = 96;

  itens.forEach((i) => {
    doc.setDrawColor(180);

    doc.line(10, y, 200, y);

    y += 4;

    /* TITULO ITEM */

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text("• " + i.descricao, 12, y);

    y += 4;

    /* CAIXA */

    doc.rect(10, y, 190, 42);

    /* DESENHO */

    doc.rect(12, y + 2, 28, 28);

    desenharJanela(doc, 12, y + 2, i.desenho);

    /* INFO ESQUERDA */

    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.text("Item:", 48, y + 6);

    doc.setFont("helvetica", "normal");
    doc.text(i.item, 60, y + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Ambiente:", 48, y + 13);

    doc.setFont("helvetica", "bold");
    doc.text("Largura x Altura:", 48, y + 20);

    doc.setFont("helvetica", "normal");
    doc.text(i.largura, 86, y + 20);

    doc.setFont("helvetica", "bold");
    doc.text("Valor Unitário:", 48, y + 30);

    doc.setFont("helvetica", "normal");
    doc.text("R$ " + i.unitario, 82, y + 30);

    /* INFO DIREITA */

    doc.setFont("helvetica", "bold");
    doc.text("Trat./Cor:", 120, y + 6);

    doc.setFont("helvetica", "normal");
    doc.text(i.cor, 145, y + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Vidro/Chapa:", 120, y + 13);

    doc.setFont("helvetica", "normal");
    doc.text(i.vidro, 154, y + 13);

    doc.setFont("helvetica", "bold");
    doc.text("Qtde:", 120, y + 24);

    doc.setFont("helvetica", "normal");
    doc.text(String(i.qtde), 136, y + 24);

    doc.setFont("helvetica", "bold");
    doc.text("Valor Total:", 120, y + 33);

    doc.setFont("helvetica", "normal");
    doc.text("R$ " + i.total, 153, y + 33);

    y += 48;
  });

  doc.save("orcamento-pro.pdf");
}

/* LOGO */

function desenharLogo(doc, x, y) {
  doc.rect(x, y, 8, 18);
  doc.rect(x + 10, y, 8, 18);
  doc.rect(x + 20, y, 8, 18);

  doc.line(x + 8, y, x + 10, y);
  doc.line(x + 18, y, x + 20, y);
}

/* DESENHOS */

function desenharJanela(doc, x, y, tipo) {
  doc.rect(x + 2, y + 2, 24, 22);

  if (tipo === "⇄") {
    doc.line(x + 14, y + 2, x + 14, y + 24);

    doc.text("↔", x + 8, y + 14);
    doc.text("↔", x + 16, y + 14);
  }

  if (tipo === "▽") {
    doc.line(x + 3, y + 3, x + 14, y + 22);
    doc.line(x + 25, y + 3, x + 14, y + 22);
  }
}