import React, { useEffect, useState } from "react";

export default function BibliotecaIndustrial() {

  const [tipo, setTipo] = useState("perfis");

  const [itens, setItens] = useState([]);

  const [busca, setBusca] = useState("");

  const [erro, setErro] = useState("");


  // =====================================
  // CARREGAR BIBLIOTECA
  // =====================================

  const carregarBiblioteca = async () => {

    try {

      setErro("");

      const response = await fetch(
        `http://localhost:3001/api/biblioteca?tipo=${tipo}`
      );

      if (!response.ok) {
        throw new Error("Erro API");
      }

      const data = await response.json();

      setItens(data);

    } catch (error) {

      console.log(error);

      setErro("Erro ao carregar biblioteca.");
    }
  };


  // =====================================

  useEffect(() => {

    carregarBiblioteca();

  }, [tipo]);


  // =====================================

  const itensFiltrados = itens.filter((item) => {

    const texto = (
      item.nome +
      item.codigo
    ).toLowerCase();

    return texto.includes(
      busca.toLowerCase()
    );

  });


  // =====================================

  return (
    <div
      style={{
        padding: 30,
        background: "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      <h1
        style={{
          fontSize: 40,
          marginBottom: 10
        }}
      >
        Biblioteca Industrial
      </h1>

      <p
        style={{
          marginBottom: 20
        }}
      >
        Biblioteca visual de perfis,
        acessórios e vidros.
      </p>


      {/* ERRO */}

      {erro && (

        <div
          style={{
            background: "#fecaca",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20
          }}
        >
          {erro}
        </div>

      )}


      {/* FILTROS */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}
      >

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            minWidth: 200
          }}
        >

          <option value="perfis">
            Perfis
          </option>

          <option value="vidros">
            Vidros
          </option>

          <option value="acessorios">
            Acessórios
          </option>

        </select>


        <input
          type="text"
          placeholder="Buscar código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10
          }}
        />

      </div>


      {/* LISTA */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(300px,1fr))",
          gap: 20
        }}
      >

        {itensFiltrados.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 15,
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
{item.imagem && (

  <img
    src={item.imagem}
    alt={item.nome}
    style={{
      width: "100%",
      height: 180,
      objectFit: "cover",
      borderRadius: 10,
      marginBottom: 15
    }}
  />

)}
            <h2
              style={{
                marginBottom: 10
              }}
            >
              {item.nome}
            </h2>

            <p>
              Código:
              <strong>
                {" "}
                {item.codigo}
              </strong>
            </p>

            {item.linha && (
              <p>
                Linha:
                <strong>
                  {" "}
                  {item.linha}
                </strong>
              </p>
            )}

            <p>
              Valor:
              <strong>
                {" "}
                R$ {item.valor}
              </strong>
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}