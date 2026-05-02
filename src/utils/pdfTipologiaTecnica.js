import jsPDF from "jspdf";
import {
  carregarImagemComoDataURL,
  desenharTitulo,
  desenharSubtitulo,
  desenharLinha,
  desenharBlocoInfo,
  desenharTabelaSimples,
  moeda,
  garantirNovaPagina,
} from "./pdfHelpers";

export async function gerarPdfTipologiaTecnica(tipologia) {
  if (!tipologia) {
    alert("Tipologia não encontrada");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  let y = 18;

  desenharTitulo(doc, "TIPOLOGIA TÉCNICA", y);
  y += 7;

  desenharSubtitulo(
    doc,
    "R&A VIDROS E ESQUADRIAS - Memorial técnico da tipologia",
    y
  );
  y += 6;

  desenharLinha(doc, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(tipologia.nome || "-", 14, y);

  if (tipologia.imagem) {
    const dataUrl = await carregarImagemComoDataURL(
      `http://localhost:3001${tipologia.imagem}`
    );
    if (dataUrl) {
      doc.addImage(dataUrl, "PNG", 145, 18, 45, 30);
    }
  }

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Linha: ${tipologia.linha || "-"}`, 14, y);
  y += 8;

  desenharBlocoInfo(doc, "Largura padrão", tipologia.larguraPadrao || 0, 14, y);
  desenharBlocoInfo(doc, "Altura padrão", tipologia.alturaPadrao || 0, 72, y);
  desenharBlocoInfo(
    doc,
    "Editar medidas",
    tipologia.permiteEditarMedidas ? "Sim" : "Não",
    130,
    y
  );

  y += 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Observação técnica", 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const obs = doc.splitTextToSize(
    tipologia.observacaoTecnica || "-",
    180
  );
  doc.text(obs, 14, y);
  y += obs.length * 4 + 6;

  const perfis = Array.isArray(tipologia.perfis) ? tipologia.perfis : [];
  const vidros = Array.isArray(tipologia.vidros) ? tipologia.vidros : [];
  const acessorios = Array.isArray(tipologia.acessorios)
    ? tipologia.acessorios
    : [];

  const perfisLinhas = perfis.map((p) => ({
    codigo: p.codigo || "",
    nome: p.nome || "",
    qtd: p.quantidade || 0,
    und: p.unidade || "",
    valor: moeda(p.valorUnitario || 0),
    obs: p.observacao || "",
  }));

  const vidrosLinhas = vidros.map((v) => ({
    codigo: v.codigo || "",
    nome: v.nome || "",
    qtd: v.quantidade || 0,
    und: v.unidade || "",
    valor: moeda(v.valorUnitario || 0),
    obs: v.observacao || "",
  }));

  const acessoriosLinhas = acessorios.map((a) => ({
    codigo: a.codigo || "",
    nome: a.nome || "",
    qtd: a.quantidade || 0,
    und: a.unidade || "",
    valor: moeda(a.valorUnitario || 0),
    obs: a.observacao || "",
  }));

  y = desenharTabelaSimples(
    doc,
    "Perfis",
    [
      { label: "Código", key: "codigo", w: 24 },
      { label: "Nome", key: "nome", w: 55 },
      { label: "Qtd", key: "qtd", w: 15 },
      { label: "Und", key: "und", w: 15 },
      { label: "Valor", key: "valor", w: 28 },
      { label: "Obs", key: "obs", w: 45 },
    ],
    perfisLinhas,
    y
  );

  y = desenharTabelaSimples(
    doc,
    "Vidros",
    [
      { label: "Código", key: "codigo", w: 24 },
      { label: "Nome", key: "nome", w: 55 },
      { label: "Qtd", key: "qtd", w: 15 },
      { label: "Und", key: "und", w: 15 },
      { label: "Valor", key: "valor", w: 28 },
      { label: "Obs", key: "obs", w: 45 },
    ],
    vidrosLinhas,
    y
  );

  y = desenharTabelaSimples(
    doc,
    "Acessórios",
    [
      { label: "Código", key: "codigo", w: 24 },
      { label: "Nome", key: "nome", w: 55 },
      { label: "Qtd", key: "qtd", w: 15 },
      { label: "Und", key: "und", w: 15 },
      { label: "Valor", key: "valor", w: 28 },
      { label: "Obs", key: "obs", w: 45 },
    ],
    acessoriosLinhas,
    y
  );

  y = garantirNovaPagina(doc, y, 20);

  const totalPerfis = perfis.reduce(
    (acc, item) =>
      acc + Number(item.quantidade || 0) * Number(item.valorUnitario || 0),
    0
  );
  const totalVidros = vidros.reduce(
    (acc, item) =>
      acc + Number(item.quantidade || 0) * Number(item.valorUnitario || 0),
    0
  );
  const totalAcessorios = acessorios.reduce(
    (acc, item) =>
      acc + Number(item.quantidade || 0) * Number(item.valorUnitario || 0),
    0
  );
  const totalGeral = totalPerfis + totalVidros + totalAcessorios;

  desenharBlocoInfo(doc, "Total Perfis", moeda(totalPerfis), 14, y, 55, 16);
  desenharBlocoInfo(doc, "Total Vidros", moeda(totalVidros), 72, y, 55, 16);
  desenharBlocoInfo(
    doc,
    "Total Acessórios",
    moeda(totalAcessorios),
    130,
    y,
    60,
    16
  );

  y += 20;
  desenharBlocoInfo(doc, "Total Técnico", moeda(totalGeral), 14, y, 70, 16);

  doc.save(
    `TIPOLOGIA_TECNICA_${String(tipologia.nome || "TIPOLOGIA").replace(/\s+/g, "_")}.pdf`
  );
}