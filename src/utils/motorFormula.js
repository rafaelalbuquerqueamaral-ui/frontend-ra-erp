export function calcularFormula(formula, largura, altura) {
  try {
    if (!formula) return 0;

    const L = Number(largura || 0);
    const H = Number(altura || 0);

    let exp = String(formula)
      .toUpperCase()
      .replaceAll("L", L)
      .replaceAll("H", H)
      .replaceAll(",", ".");

    if (!/^[0-9+\-*/().\s]+$/.test(exp)) return 0;

    // eslint-disable-next-line no-new-func
    return Number(Function(`"use strict"; return (${exp})`)() || 0);
  } catch {
    return 0;
  }
}

export function gerarMateriaisDaTipologia(tipologia, largura, altura) {
  let mats = [];

  try {
    mats = Array.isArray(tipologia.materiais)
      ? tipologia.materiais
      : JSON.parse(tipologia.materiais || "[]");
  } catch {
    mats = [];
  }

  return mats.map((m) => {
    const medida = calcularFormula(m.formula, largura, altura);
    const qtd = Number(m.qtd || 1);

    return {
      ...m,
      medida,
      quantidade: qtd,
      total_medida: medida * qtd,
    };
  });
}

export function gerarListaCorte(materiais, barraPadrao = 6000, perdaSerra = 3) {
  const pecas = [];

  materiais
    .filter((m) => m.tipo === "PERFIS")
    .forEach((m) => {
      for (let i = 0; i < Number(m.quantidade || 1); i++) {
        pecas.push({
          codigo: m.codigo,
          nome: m.nome,
          medida: Number(m.medida || 0),
          corte: m.corte || "90/90",
        });
      }
    });

  pecas.sort((a, b) => b.medida - a.medida);

  const barras = [];

  pecas.forEach((peca) => {
    let encaixou = false;

    for (const barra of barras) {
      const novoUsado = barra.usado + peca.medida + perdaSerra;

      if (novoUsado <= barraPadrao) {
        barra.pecas.push(peca);
        barra.usado = novoUsado;
        barra.sobra = barraPadrao - novoUsado;
        encaixou = true;
        break;
      }
    }

    if (!encaixou) {
      barras.push({
        usado: peca.medida,
        sobra: barraPadrao - peca.medida,
        pecas: [peca],
      });
    }
  });

  return barras;
}
