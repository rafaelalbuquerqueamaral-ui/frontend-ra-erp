// src/pages/Perfis.js

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Perfis() {
  const [perfis, setPerfis] = useState([]);

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [peso, setPeso] = useState("");
  const [valorKg, setValorKg] = useState("");
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    carregarPerfis();
  }, []);

  const carregarPerfis = async () => {
    try {
      const res = await api.get("/perfis");
      setPerfis(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const salvarPerfil = async () => {
    try {
      await api.post("/perfis", {
        nome,
        codigo,
        peso,
        valor_kg: valorKg,
        imagem,
      });

      setNome("");
      setCodigo("");
      setPeso("");
      setValorKg("");
      setImagem("");

      carregarPerfis();
    } catch (err) {
      console.log(err);
      alert("Erro ao salvar perfil");
    }
  };

  const excluirPerfil = async (id) => {
    try {
      await api.delete(`/perfis/${id}`);
      carregarPerfis();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Perfis</h1>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <input
          placeholder="Peso KG"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />

        <input
          placeholder="Valor por KG"
          value={valorKg}
          onChange={(e) => setValorKg(e.target.value)}
        />

        <input
          placeholder="URL da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />

        <button onClick={salvarPerfil}>
          Salvar Perfil
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        {perfis.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 15,
            }}
          >
            {p.imagem && (
              <img
                src={p.imagem}
                alt=""
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            )}

            <h3>{p.nome}</h3>

            <p>Código: {p.codigo}</p>

            <p>Peso: {p.peso}</p>

            <p>R$ KG: {p.valor_kg}</p>

            <button
              onClick={() => excluirPerfil(p.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}