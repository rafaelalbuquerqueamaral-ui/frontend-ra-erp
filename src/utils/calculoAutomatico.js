export function calcularFormula(formula, vars) {
  try {
    const { L, H, QTD, LM, HM } = vars;
    const fn = new Function("L", "H", "QTD", "LM", "HM", `return ${formula}`);
    return Number(fn(L, H, QTD, LM, HM) || 0);
  } catch {
    return 0;
  }
}

export function calcularItemIndustrial({
  tipologia,
  largura,
  altura,
  quantidade,
}) {
  const L = Number(largura || 0);
  const H = Number(altura || 0);
  const QTD = Number(quantidade || 1);
  const LM = L;
  const HM = H;

  const area = (L / 1000) * (H / 1000) * QTD;

  const perfis = tipologia?.perfis || [];
  const acessorios = tipologia?.acessorios || [];
  const vidros = tipologia?.vidros || [];

  const materiaisPerfis = perfis.map((p) => {
    const medidaMM = calcularFormula(p.formula || "0", { L, H, QTD, LM, HM });
    const qtd = Number(p.qtd || 1) * QTD;

    const totalMM = medidaMM * qtd;
    const totalM = totalMM / 1000;

    const pesoKgMetro = Number(p.pesoKgMetro || p.peso || 0);
    const valorKg = Number(p.valorKg || p.valor || 0);

    const pesoTotalKg = totalM * pesoKgMetro;
    const valor = pesoTotalKg * valorKg;

    return {
      tipo: "PERFIL",
      codigo: p.codigo || "",
      nome: p.nome || p.descricao || "",
      formula: p.formula || "",
      qtd,
      medidaMM,
      totalMM,
      totalM,
      pesoKgMetro,
      pesoTotalKg,
      valorKg,
      valor,
    };
  });

  const materiaisVidro =
    vidros.length > 0
      ? vidros.map((v) => {
          const areaVidro = calcularFormula(v.formula || "L*H/1000000", {
            L,
            H,
            QTD,
            LM,
            HM,
          }) * QTD;

          const valorM2 = Number(v.valorM2 || v.valor || 120);
          const valor = areaVidro * valorM2;

          return {
            tipo: "VIDRO",
            codigo: v.codigo || "VIDRO",
            nome: v.nome || "Vidro",
            formula: v.formula || "L*H/1000000",
            qtd: QTD,
            areaM2: areaVidro,
            valorM2,
            valor,
          };
        })
      : [
          {
            tipo: "VIDRO",
            codigo: "VIDRO",
            nome: "Vidro automático",
            formula: "L*H/1000000",
            qtd: QTD,
            areaM2: area,
            valorM2: 120,
            valor: area * 120,
          },
        ];

  const materiaisAcessorios = acessorios.map((a) => {
    const qtd = calcularFormula(a.formula || "QTD", { L, H, QTD, LM, HM });
    const valorUn = Number(a.valor || 0);
    const valor = qtd * valorUn;

    return {
      tipo: "ACESSÓRIO",
      codigo: a.codigo || "",
      nome: a.nome || "",
      formula: a.formula || "QTD",
      qtd,
      valorUn,
      valor,
    };
  });

  const valorPerfis = materiaisPerfis.reduce((s, m) => s + m.valor, 0);
  const valorVidros = materiaisVidro.reduce((s, m) => s + m.valor, 0);
  const valorAcessorios = materiaisAcessorios.reduce((s, m) => s + m.valor, 0);

  const subtotal = valorPerfis + valorVidros + valorAcessorios;
  const margem = subtotal * 0.25;
  const total = subtotal + margem;

  return {
    area,
    materiais: [
      ...materiaisPerfis,
      ...materiaisVidro,
      ...materiaisAcessorios,
    ],
    valorPerfis,
    valorVidros,
    valorAcessorios,
    subtotal,
    margem,
    total,
  };
}