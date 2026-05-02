// Otimização simples (First Fit Decreasing)
export function otimizarCortePerfis(materiais, barra = 6000, perda = 3) {
  // Extrai só perfis e quebra em peças unitárias
  const pecas = [];

  materiais
    .filter(m => m.tipo === "PERFIL")
    .forEach(m => {
      const qtd = Number(m.qtd || 0);
      const medida = Number(m.medidaMM || 0);

      for (let i = 0; i < qtd; i++) {
        pecas.push({
          codigo: m.codigo,
          nome: m.nome,
          medida
        });
      }
    });

  // Ordena do maior para o menor
  pecas.sort((a, b) => b.medida - a.medida);

  const barras = [];

  pecas.forEach(p => {
    let encaixou = false;

    for (let b of barras) {
      const usado = b.pecas.reduce(
        (s, x) => s + x.medida + perda,
        0
      );

      if (usado + p.medida + perda <= barra) {
        b.pecas.push(p);
        encaixou = true;
        break;
      }
    }

    if (!encaixou) {
      barras.push({
        id: barras.length + 1,
        pecas: [p]
      });
    }
  });

  // cálculo final
  return barras.map(b => {
    const usado = b.pecas.reduce(
      (s, x) => s + x.medida + perda,
      0
    );

    return {
      ...b,
      usado,
      sobra: barra - usado
    };
  });
}