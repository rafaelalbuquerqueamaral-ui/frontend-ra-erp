export function calcularExpressao(expressao, L, A) {
  try {
    if (!expressao || expressao.trim() === "") {
      return 0;
    }

    let formula = expressao;

    formula = formula.replaceAll("L", Number(L || 0));
    formula = formula.replaceAll("A", Number(A || 0));

    const resultado = eval(formula);

    return Number(resultado.toFixed(2));
  } catch (error) {
    console.error("Erro fórmula:", expressao);
    return 0;
  }
}

export function calcularMateriais(
  materiais = [],
  largura = 0,
  altura = 0
) {
  const resultado = [];

  for (const material of materiais) {
    const larguraCalc = calcularExpressao(
      material.formula_largura,
      largura,
      altura
    );

    const alturaCalc = calcularExpressao(
      material.formula_altura,
      largura,
      altura
    );

    const quantidadeCalc = calcularExpressao(
      material.formula_quantidade || "1",
      largura,
      altura
    );

    resultado.push({
      ...material,

      largura_calculada: larguraCalc,
      altura_calculada: alturaCalc,
      quantidade_calculada: quantidadeCalc,
    });
  }

  return resultado;
}