import React, {
  useEffect,
  useState
} from "react";

export default function Tipologias() {

  // ====================================
  // ESTADOS
  // ====================================

  const [nome, setNome] =
    useState("");

  const [linha, setLinha] =
    useState("Suprema");

  const [largura, setLargura] =
    useState("");

  const [altura, setAltura] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [imagem, setImagem] =
    useState("");

  const [lista, setLista] =
    useState([]);
useEffect(() => {

  carregarTipologias();

}, []);
  const [editandoId, setEditandoId] =
    useState(null);
// ====================================
// CARREGAR
// ====================================

const carregarTipologias =
async () => {

  try {

    const response =
      await fetch(
        "http://localhost:3001/api/tipologias"
      );

    const data =
      await response.json();

    setLista(data);

  } catch (error) {

    console.log(error);

  }

};

  // ====================================
  // SALVAR
  // ====================================

  const salvar = async () => {

  if (
    !nome ||
    !largura ||
    !altura
  ) return;


  const dados = {

    nome,

    linha,

    largura,

    altura,

    observacao,

    imagem

  };


  try {

    // ==========================
    // EDITAR
    // ==========================

    if (editandoId) {

      await fetch(

        `http://localhost:3001/api/tipologias/${editandoId}`,

        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            dados
          )

        }

      );

    }

    // ==========================
    // NOVO
    // ==========================

    else {

      await fetch(

        "http://localhost:3001/api/tipologias",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            dados
          )

        }

      );

    }


    await carregarTipologias();

    setEditandoId(null);

    limpar();

  } catch (error) {

    console.log(error);

  }

};


  // ====================================
  // LIMPAR
  // ====================================

  const limpar = () => {

    setNome("");

    setLinha("Suprema");

    setLargura("");

    setAltura("");

    setObservacao("");

    setImagem("");

  };


  // ====================================
  // EXCLUIR
  // ====================================

  const excluir = async (id) => {

  try {

    await fetch(

      `http://localhost:3001/api/tipologias/${id}`,

      {
        method: "DELETE"
      }

    );

    await carregarTipologias();

  } catch (error) {

    console.log(error);

  }

};


  // ====================================
  // COPIAR
  // ====================================

  const copiar = (item) => {

    const copia = {

      ...item,

      id: Date.now(),

      nome:
        item.nome +
        " CÓPIA"

    };

    setLista([
      ...lista,
      copia
    ]);

  };


  // ====================================
  // EDITAR
  // ====================================

  const editar = (item) => {

    setEditandoId(item.id);

    setNome(item.nome);

    setLinha(item.linha);

    setLargura(item.largura);

    setAltura(item.altura);

    setObservacao(
      item.observacao
    );

    setImagem(item.imagem);

  };


  // ====================================

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
          fontSize: 38,
          marginBottom: 10
        }}
      >
        Cadastro de Tipologias
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Biblioteca industrial
      </p>


      {/* FORMULÁRIO */}

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 15,
          marginBottom: 30
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,1fr)",
            gap: 15
          }}
        >

          <input
            placeholder="Nome da tipologia"
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            style={styles.input}
          />


          <select
            value={linha}
            onChange={(e) =>
              setLinha(
                e.target.value
              )
            }
            style={styles.input}
          >

            <option>
              Suprema
            </option>

            <option>
              Gold
            </option>

          </select>


          <input
            type="number"
            placeholder="Largura padrão"
            value={largura}
            onChange={(e) =>
              setLargura(
                e.target.value
              )
            }
            style={styles.input}
          />


          <input
            type="number"
            placeholder="Altura padrão"
            value={altura}
            onChange={(e) =>
              setAltura(
                e.target.value
              )
            }
            style={styles.input}
          />


          <input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const arquivo = e.target.files[0];

    if (!arquivo) return;

    const formData = new FormData();
    formData.append("imagem", arquivo);

    const response = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setImagem(data.imagem);
  }}
  style={styles.input}
/>


          <textarea
            placeholder="Observação técnica"
            value={observacao}
            onChange={(e) =>
              setObservacao(
                e.target.value
              )
            }
            style={{
              ...styles.input,
              minHeight: 80
            }}
          />

        </div>


        <button
          onClick={salvar}
          style={styles.botao}
        >

          {editandoId

            ? "Atualizar Tipologia"

            : "Salvar Tipologia"}

        </button>

      </div>


      {/* LISTA */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 20
        }}
      >

        {lista.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: 15,
              overflow: "hidden"
            }}
          >

            {/* IMAGEM */}

            <div
              style={{
                height: 220,
                background:
                  "#cbd5e1"
              }}
            >

              {item.imagem ? (

                <img
                  src={item.imagem}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      "cover"
                  }}
                />

              ) : (

                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center"
                  }}
                >

                  Sem imagem

                </div>

              )}

            </div>


            {/* CONTEÚDO */}

            <div
              style={{
                padding: 20
              }}
            >

              <h2>
                {item.nome}
              </h2>

              <p>
                Linha:
                {" "}
                {item.linha}
              </p>

              <p>
                Medidas:
                {" "}
                {item.largura}
                {" x "}
                {item.altura}
                mm
              </p>

              <p>
                {
                  item.observacao
                }
              </p>


              {/* BOTÕES */}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                  flexWrap: "wrap"
                }}
              >

                <button
                  onClick={() =>
                    editar(item)
                  }
                  style={{
                    ...styles.botaoPequeno,
                    background:
                      "#0f172a"
                  }}
                >
                  Editar
                </button>


                <button
                  onClick={() =>
                    copiar(item)
                  }
                  style={{
                    ...styles.botaoPequeno,
                    background:
                      "#2563eb"
                  }}
                >
                  Copiar
                </button>


                <button
                  onClick={() =>
                    excluir(
                      item.id
                    )
                  }
                  style={{
                    ...styles.botaoPequeno,
                    background:
                      "#dc2626"
                  }}
                >
                  Excluir
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}


// ====================================
// ESTILOS
// ====================================

const styles = {

  input: {
    padding: 12,
    borderRadius: 10,
    border:
      "1px solid #ccc"
  },

  botao: {
    marginTop: 20,
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding:
      "12px 20px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  botaoPequeno: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding:
      "10px 16px",
    cursor: "pointer",
    fontWeight: "bold"
  }

};