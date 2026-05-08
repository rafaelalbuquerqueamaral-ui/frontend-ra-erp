// ============================================
// MOTOR DE CÁLCULO INDUSTRIAL
// R&A VIDROS E ESQUADRIAS
// ============================================

export function calcularItemIndustrial(item) {
  const largura = Number(item.largura || 0);
  const altura = Number(item.altura || 0);
  const quantidade = Number(item.quantidade || 1);

  // =========================
  // PERFIS
  // =========================

  const perfis = [];

  const perimetro = (largura * 2) + (altura * 2);

  const barras = Math.ceil((perimetro * quantidade) / 6000);

  const pesoLinear = Number(item.pesoLinear || 1.2);

  const kgTotal =
    ((perimetro / 1000) * pesoLinear) * quantidade;

  const valorKg = Number(item.valorKg || 45);

  const valorPerfis = kgTotal * valorKg;

  perfis.push({
    nome: "Perfil Alumínio",
    perimetro,
    barras,
    kgTotal,
    valor: valorPerfis
  });

  // =========================
  // VIDRO
  // =========================

  const area =
    (largura / 1000) *
    (altura / 1000) *
    quantidade;

  const valorM2Vidro =
    Number(item.valorM2Vidro || 120);

  const valorVidro =
    area * valorM2Vidro;

  // =========================
  // ACESSÓRIOS
  // =========================

  const valorAcessorios =
    Number(item.valorAcessorios || 50) *
    quantidade;

  // =========================
  // TOTAL
  // =========================

  const subtotal =
    valorPerfis +
    valorVidro +
    valorAcessorios;

  const margem =
    Number(item.margem || 100);

  const valorFinal =
    subtotal +
    margem;

  return {
    largura,
    altura,
    quantidade,

    area,

    perfis,

    vidro: {
      area,
      valor: valorVidro
    },

    acessorios: {
      valor: valorAcessorios
    },

    resumo: {
      valorPerfis,
      valorVidro,
      valorAcessorios,
      subtotal,
      margem,
      valorFinal
    }
  };
}