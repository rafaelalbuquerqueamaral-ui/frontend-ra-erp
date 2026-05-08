export async function buscarBiblioteca(tipo) {

  const response = await fetch(
    `http://localhost:3001/api/biblioteca?tipo=${tipo}`
  );

  return await response.json();
}