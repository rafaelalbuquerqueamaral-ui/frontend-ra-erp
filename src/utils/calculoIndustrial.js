export function calcularFormula(formula, largura, altura) {
  if (!formula) return 0;

  try {
    const expressao = formula
      .replace(/L/g, largura)
      .replace(/A/g, altura);

    const resultado = eval(expressao);

    return Number(resultado) || 0;
  } catch (e) {
    return 0;
  }
}

export function calcularMateriaisTipologia(
  materiais,
  largura,
  altura
) {
  return materiais.map((item) => {

    const comprimento = calcularFormula(
      item.formula_largura || "0",
      largura,
      altura
    );

    const alturaFinal = calcularFormula(
      item.formula_altura || "0",
      largura,
      altura
    );

    const quantidade = calcularFormula(
      item.formula_quantidade || "1",
      largura,
      altura
    );

    const total = comprimento * quantidade;

    return {
      ...item,

      comprimento,
      alturaFinal,
      quantidade,
      total
    };
  });
}

export function calcularBarras(lista) {

  return lista.map((item) => {

    const barra = 6000;

    const barrasNecessarias = Math.ceil(
      (item.total || 0) / barra
    );

    return {
      ...item,
      barrasNecessarias
    };
  });
}

export function calcularVidroM2(
  largura,
  altura,
  quantidade = 1
) {
  const area =
    (largura / 1000) *
    (altura / 1000) *
    quantidade;

  return Number(area.toFixed(2));
}