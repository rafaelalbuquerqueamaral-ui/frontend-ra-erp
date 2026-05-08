// ========================================
// MOTOR INTELIGENTE INDUSTRIAL
// R&A VIDROS E ESQUADRIAS
// ========================================


// ========================================
// TIPOLOGIAS
// ========================================

const TIPOLOGIAS = {

  "Janela de Correr 2 Folhas": {

    perfis: [
      "Marco Superior",
      "Marco Inferior",
      "Marco Lateral",
      "Folha Vertical",
      "Folha Horizontal"
    ],

    acessorios: [
      "Fecho",
      "Roldana",
      "Escova"
    ],

    divisorFolhas: 2
  },


  "Janela de Correr 4 Folhas": {

    perfis: [
      "Marco Superior",
      "Marco Inferior",
      "Marco Lateral",
      "Folha Vertical",
      "Folha Horizontal",
      "Trilho"
    ],

    acessorios: [
      "Fecho",
      "Roldana",
      "Escova",
      "Guia"
    ],

    divisorFolhas: 4
  },


  "Porta de Giro": {

    perfis: [
      "Batente",
      "Travessa",
      "Folha Vertical",
      "Folha Horizontal"
    ],

    acessorios: [
      "Fechadura",
      "Dobradiça",
      "Puxador"
    ],

    divisorFolhas: 1
  }

};


// ========================================
// CÁLCULO PRINCIPAL
// ========================================

export function calcularTipologiaIndustrial({
  tipologia,
  largura,
  altura,
  quantidade = 1,
  linha = "Suprema",
  valorKg = 45,
  valorVidro = 120,
  valorAcessorios = 50,
  margem = 100
}) {

  const config =
    TIPOLOGIAS[tipologia];

  if (!config) {

    return null;

  }


  // =====================================
  // DIVISÃO DE FOLHAS
  // =====================================

  const larguraFolha =
    largura /
    config.divisorFolhas;


  // =====================================
  // ÁREA VIDRO
  // =====================================

  const areaVidro =
    (
      (largura / 1000) *
      (altura / 1000)
    ) * quantidade;


  // =====================================
  // KG ALUMÍNIO
  // =====================================

  const pesoLinear =
    linha === "Gold"
      ? 1.5
      : 1.2;


  const perimetro =
    (
      largura * 2 +
      altura * 2
    ) / 1000;


  const kgAluminio =
    (
      perimetro *
      pesoLinear
    ) * quantidade;


  // =====================================
  // VALORES
  // =====================================

  const valorPerfis =
    kgAluminio *
    valorKg;

  const valorTotalVidro =
    areaVidro *
    valorVidro;

  const valorTotalAcessorios =
    config.acessorios.length *
    valorAcessorios *
    quantidade;


  const subtotal =
    valorPerfis +
    valorTotalVidro +
    valorTotalAcessorios;


  const valorFinal =
    subtotal +
    margem;


  // =====================================
  // LISTA DE CORTE
  // =====================================

  const listaCorte = [];

  config.perfis.forEach(
    (perfil) => {

      listaCorte.push({

        perfil,

        medida:
          perfil.includes(
            "Vertical"
          )
            ? altura
            : largura,

        quantidade

      });

    }
  );


  // =====================================
  // RETORNO
  // =====================================

  return {

    tipologia,

    linha,

    largura,

    altura,

    quantidade,

    larguraFolha,

    areaVidro,

    kgAluminio,

    perfis:
      config.perfis,

    acessorios:
      config.acessorios,

    listaCorte,

    resumo: {

      valorPerfis,

      valorVidro:
        valorTotalVidro,

      valorAcessorios:
        valorTotalAcessorios,

      subtotal,

      margem,

      valorFinal

    }

  };

}