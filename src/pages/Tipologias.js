// src/pages/Tipologias.js

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tipologias() {
  const [tipologias, setTipologias] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    nome: "",
    linha: "Gold",
    categoria: "",
    largura_padrao: "",
    altura_padrao: "",
    permite_editar_medidas: true,
    vidro: "",
    perfil: "",
    acessorios: "",
    valor_base: "",
    observacao_tecnica: "",
  });

  useEffect(() => {
    carregarTipologias();
  }, []);

  const carregarTipologias = async () => {
    try {
      const res = await api.get("/tipologias");
      setTipologias(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.log(err);
    }
  };

  const selecionarImagem = (e) => {
    const file = e.target.files[0];

    setImagem(file);

    if (file) {
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  const salvarTipologia = async () => {
    try {
      let imagemUrl = "";

      if (imagem) {
        const formData =
          new FormData();

        formData.append(
          "imagem",
          imagem
        );

        const upload =
          await api.post(
            "/upload-tipologia",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        imagemUrl =
          upload.data.imagem;
      }

      await api.post(
        "/tipologias",
        {
          ...form,
          imagem: imagemUrl,
        }
      );

      setForm({
        nome: "",
        linha: "Gold",
        categoria: "",
        largura_padrao: "",
        altura_padrao: "",
        permite_editar_medidas: true,
        vidro: "",
        perfil: "",
        acessorios: "",
        valor_base: "",
        observacao_tecnica: "",
      });

      setImagem(null);
      setPreview("");

      carregarTipologias();

      alert(
        "Tipologia salva!"
      );
    } catch (err) {
      console.log(err);
      alert(
        "Erro ao salvar tipologia"
      );
    }
  };

  return (
    <div style={page}>
      <h1>
        Tipologias PRO
      </h1>

      <div style={card}>
        <h2>
          Cadastro Técnico
        </h2>

        <div style={grid}>
          <input
            style={input}
            placeholder="Nome"
            value={form.nome}
            onChange={(e) =>
              setForm({
                ...form,
                nome:
                  e.target.value,
              })
            }
          />

          <select
            style={input}
            value={form.linha}
            onChange={(e) =>
              setForm({
                ...form,
                linha:
                  e.target.value,
              })
            }
          >
            <option>
              Gold
            </option>

            <option>
              Suprema
            </option>

            <option>
              Integrada
            </option>
          </select>

          <input
            style={input}
            placeholder="Categoria"
            value={
              form.categoria
            }
            onChange={(e) =>
              setForm({
                ...form,
                categoria:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Largura padrão"
            value={
              form.largura_padrao
            }
            onChange={(e) =>
              setForm({
                ...form,
                largura_padrao:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Altura padrão"
            value={
              form.altura_padrao
            }
            onChange={(e) =>
              setForm({
                ...form,
                altura_padrao:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Vidro"
            value={form.vidro}
            onChange={(e) =>
              setForm({
                ...form,
                vidro:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Perfil"
            value={form.perfil}
            onChange={(e) =>
              setForm({
                ...form,
                perfil:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Acessórios"
            value={
              form.acessorios
            }
            onChange={(e) =>
              setForm({
                ...form,
                acessorios:
                  e.target.value,
              })
            }
          />

          <input
            style={input}
            placeholder="Valor base"
            value={
              form.valor_base
            }
            onChange={(e) =>
              setForm({
                ...form,
                valor_base:
                  e.target.value,
              })
            }
          />

          <input
            type="file"
            onChange={
              selecionarImagem
            }
          />
        </div>

        <textarea
          style={textarea}
          placeholder="Observação técnica"
          value={
            form.observacao_tecnica
          }
          onChange={(e) =>
            setForm({
              ...form,
              observacao_tecnica:
                e.target.value,
            })
          }
        />

        {preview && (
          <img
            src={preview}
            alt=""
            style={previewImg}
          />
        )}

        <button
          style={btn}
          onClick={
            salvarTipologia
          }
        >
          Salvar Tipologia
        </button>
      </div>

      <div style={card}>
        <h2>
          Biblioteca Técnica
        </h2>

        <div style={cards}>
          {tipologias.map(
            (t) => (
              <div
                key={t.id}
                style={
                  tipologiaCard
                }
              >
                {t.imagem && (
                  <img
                    src={`https://backend-esquadrias.onrender.com${t.imagem}`}
                    alt=""
                    style={
                      imagemCard
                    }
                  />
                )}

                <h3>{t.nome}</h3>

                <p>
                  Linha:{" "}
                  {t.linha}
                </p>

                <p>
                  Categoria:{" "}
                  {t.categoria}
                </p>

                <p>
                  Medidas:
                  {
                    t.largura_padrao
                  }
                  x
                  {
                    t.altura_padrao
                  }
                </p>

                <p>
                  Vidro:{" "}
                  {t.vidro}
                </p>

                <p>
                  Perfil:{" "}
                  {t.perfil}
                </p>

                <p>
                  Valor Base:
                  R${" "}
                  {
                    t.valor_base
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const page = {
  padding: 20,
  background: "#eef2f7",
  minHeight: "100vh",
};

const card = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3,1fr)",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border:
    "1px solid #dbe2ea",
};

const textarea = {
  marginTop: 12,
  width: "100%",
  minHeight: 100,
  padding: 12,
  borderRadius: 10,
};

const btn = {
  marginTop: 15,
  padding:
    "14px 22px",
  border: "none",
  borderRadius: 10,
  background:
    "#0f172a",
  color: "#fff",
  fontWeight: "bold",
};

const previewImg = {
  width: 250,
  marginTop: 20,
  borderRadius: 12,
};

const cards = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill,minmax(300px,1fr))",
  gap: 20,
};

const tipologiaCard = {
  background: "#f8fafc",
  borderRadius: 14,
  padding: 15,
};

const imagemCard = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 10,
};