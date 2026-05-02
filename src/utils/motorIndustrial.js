export function calcularFormula(formula, vars) {
  try {
    const { L, H, QTD } = vars;
    const fn = new Function("L", "H", "QTD", `return ${formula}`);
    return Number(fn(L, H, QTD) || 0);
  } catch {
    return 0;
  }
}

export function calcularOrcamentoIndustrial({ largura, altura, quantidade }) {
  const L = Number(largura || 0);
  const H = Number(altura || 0);
  const QTD = Number(quantidade || 1);

  const perfis = [
    {
      tipo: "PERFIL",
      codigo: "LG-001",
      nome: "Marco lateral",
      formula: "H",
      qtd: 2 * QTD,
      medidaMM: H,
      pesoKgMetro: 1.2,
      valorKg: 45,
    },
    {
      tipo: "PERFIL",
      codigo: "LG-002",
      nome: "Travessa superior/inferior",
      formula: "L",
      qtd: 2 * QTD,
      medidaMM: L,
      pesoKgMetro: 1.1,
      valorKg: 45,
    },
  ];

  const materiais = [];

  perfis.forEach((p) => {
    const totalM = (p.medidaMM * p.qtd) / 1000;
    const pesoTotalKg = totalM * p.pesoKgMetro;
    const valor = pesoTotalKg * p.valorKg;

    materiais.push({
      ...p,
      totalM,
      pesoTotalKg,
      valor,
    });
  });

  const areaVidro = (L * H * QTD) / 1000000;
  const valorVidroM2 = 120;

  materiais.push({
    tipo: "VIDRO",
    codigo: "VD-006",
    nome: "Vidro 6mm",
    areaM2: areaVidro,
    valorM2: valorVidroM2,
    valor: areaVidro * valorVidroM2,
  });

  materiais.push({
    tipo: "ACESSÓRIO",
    codigo: "KIT-001",
    nome: "Kit acessórios",
    qtd: QTD,
    valorUn: 50,
    valor: QTD * 50,
  });

  const totalPerfis = materiais
    .filter((m) => m.tipo === "PERFIL")
    .reduce((s, m) => s + m.valor, 0);

  const totalVidros = materiais
    .filter((m) => m.tipo === "VIDRO")
    .reduce((s, m) => s + m.valor, 0);

  const totalAcessorios = materiais
    .filter((m) => m.tipo === "ACESSÓRIO")
    .reduce((s, m) => s + m.valor, 0);

  const subtotal = totalPerfis + totalVidros + totalAcessorios;
  const margem = subtotal * 0.3;
  const total = subtotal + margem;

  return {
    materiais,
    totalPerfis,
    totalVidros,
    totalAcessorios,
    subtotal,
    margem,
    total,
  };
}

export function otimizarCorte(materiais, barra = 6000, perdaSerra = 3) {
  const pecas = [];

  materiais
    .filter((m) => m.tipo === "PERFIL")
    .forEach((m) => {
      for (let i = 0; i < Number(m.qtd || 0); i++) {
        pecas.push({
          codigo: m.codigo,
          nome: m.nome,
          medida: Number(m.medidaMM || 0),
        });
      }
    });

  pecas.sort((a, b) => b.medida - a.medida);

  const barras = [];

  pecas.forEach((peca) => {
    let colocada = false;

    for (const b of barras) {
      const usado = b.pecas.reduce((s, p) => s + p.medida + perdaSerra, 0);

      if (usado + peca.medida + perdaSerra <= barra) {
        b.pecas.push(peca);
        colocada = true;
        break;
      }
    }

    if (!colocada) {
      barras.push({ id: barras.length + 1, pecas: [peca] });
    }
  });

  return barras.map((b) => {
    const usado = b.pecas.reduce((s, p) => s + p.medida + perdaSerra, 0);
    return {
      ...b,
      usado,
      sobra: barra - usado,
    };
  });
}