import { useState, useEffect } from "react";

export default function PainelPrecos() {
  const [dados, setDados] = useState({
    aluminio_kg: "",
    pintura_kg: "",
    vidro_incolor: "",
    vidro_fume: "",
    vidro_verde: "",
    vidro_temperado: "",
    vidro_laminado: "",
    margem: ""
  });

  useEffect(() => {
    fetch("http://localhost:3001/parametros-precos")
      .then(res => res.json())
      .then(data => {
        if (data) setDados(data);
      });
  }, []);

  function salvar() {
    fetch("http://localhost:3001/parametros-precos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    })
    .then(() => alert("Preços atualizados 🚀"));
  }

  function alterar(campo, valor) {
    setDados({ ...dados, [campo]: valor });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 Painel de Preços</h2>

      <h3>Alumínio / Pintura</h3>
      <input placeholder="Alumínio R$/kg" value={dados.aluminio_kg}
        onChange={e => alterar("aluminio_kg", e.target.value)} />

      <input placeholder="Pintura R$/kg" value={dados.pintura_kg}
        onChange={e => alterar("pintura_kg", e.target.value)} />

      <h3>Vidros (R$/m²)</h3>
      <input placeholder="Incolor" value={dados.vidro_incolor}
        onChange={e => alterar("vidro_incolor", e.target.value)} />

      <input placeholder="Fumê" value={dados.vidro_fume}
        onChange={e => alterar("vidro_fume", e.target.value)} />

      <input placeholder="Verde" value={dados.vidro_verde}
        onChange={e => alterar("vidro_verde", e.target.value)} />

      <input placeholder="Temperado" value={dados.vidro_temperado}
        onChange={e => alterar("vidro_temperado", e.target.value)} />

      <input placeholder="Laminado" value={dados.vidro_laminado}
        onChange={e => alterar("vidro_laminado", e.target.value)} />

      <h3>Margem</h3>
      <input placeholder="Margem %" value={dados.margem}
        onChange={e => alterar("margem", e.target.value)} />

      <br /><br />
      <button onClick={salvar}>Salvar</button>
    </div>
  );
}