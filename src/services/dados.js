let orcamentos = [];

export function salvarOrcamento(orc) {
  orcamentos.push(orc);
}

export function listarOrcamentos() {
  return orcamentos;
}