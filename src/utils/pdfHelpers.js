export function moeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function carregarImagemComoDataURL(url) {
  if (!url) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function desenharTitulo(doc, texto, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(texto, 14, y);
}

export function desenharSubtitulo(doc, texto, y) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(texto, 14, y);
}

export function desenharLinha(doc, y) {
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);
}

export function desenharBlocoInfo(doc, titulo, valor, x, y, w = 55, h = 16) {
  doc.setDrawColor(210, 210, 210);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(titulo, x + 3, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(String(valor ?? "-"), x + 3, y + 11.5);
}

export function garantirNovaPagina(doc, y, alturaNecessaria = 20) {
  const alturaPagina = doc.internal.pageSize.getHeight();
  if (y + alturaNecessaria > alturaPagina - 10) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function desenharTabelaSimples(doc, titulo, colunas, linhas, yInicial) {
  let y = yInicial;

  y = garantirNovaPagina(doc, y, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(titulo, 14, y);
  y += 6;

  const larguras = colunas.map((c) => c.w);
  const xs = [];
  let cursor = 14;

  larguras.forEach((w) => {
    xs.push(cursor);
    cursor += w;
  });

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(210, 210, 210);
  doc.rect(14, y, larguras.reduce((a, b) => a + b, 0), 8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  colunas.forEach((col, i) => {
    doc.text(col.label, xs[i] + 2, y + 5);
  });

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  if (!linhas.length) {
    doc.rect(14, y, larguras.reduce((a, b) => a + b, 0), 8);
    doc.text("Nenhum item", 16, y + 5);
    y += 10;
    return y;
  }

  linhas.forEach((linha) => {
    y = garantirNovaPagina(doc, y, 10);

    doc.setDrawColor(225, 225, 225);
    doc.rect(14, y, larguras.reduce((a, b) => a + b, 0), 8);

    colunas.forEach((col, i) => {
      const valor = linha[col.key] ?? "";
      doc.text(String(valor), xs[i] + 2, y + 5);
    });

    y += 8;
  });

  return y + 4;
}