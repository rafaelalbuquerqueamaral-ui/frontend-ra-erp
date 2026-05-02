export function calcularPerfis(listaPerfis) {
  let totalPeso = 0;
  let totalValor = 0;

  listaPerfis.forEach(p => {
    const comprimento = Number(p.comprimento || 0);
    const pesoMetro = Number(p.peso_metro || 0);
    const valorKg = Number(p.valor_kg || 0);

    const pesoTotal = comprimento * pesoMetro;
    const valorTotal = pesoTotal * valorKg;

    totalPeso += pesoTotal;
    totalValor += valorTotal;

    p.peso_total = pesoTotal;
    p.valor_total = valorTotal;
  });

  return {
    totalPeso,
    totalValor,
    itens: listaPerfis
  };
}