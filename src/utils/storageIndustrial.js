export function salvarMateriaisCorte(lista) {
  localStorage.setItem("lista_corte", JSON.stringify(lista));
}