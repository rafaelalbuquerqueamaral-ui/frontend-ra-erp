import React, { useMemo, useState } from "react";

export default function TipologiaInteligente() {

  // ====================================
  // ESTADOS
  // ====================================

  const [nome, setNome] =
    useState("Janela 2 Folhas");

  const [linha, setLinha] =
    useState("Suprema");

  const [largura, setLargura] =
    useState(1200);

  const [altura, setAltura] =
    useState(1000);

  const [quantidadeFolhas,
    setQuantidadeFolhas] =
    useState(2);

  const [valorKg, setValorKg] =
    useState(45);

  const [valorVidro, setValorVidro] =
    useState(120);

  const [valorAcessorios,
    setValorAcessorios] =
    useState(50);


  // ====================================
  // MOTOR INDUSTRIAL
  // ====================================

  const calculo = useMemo(() => {

    // ============================
    // DIVISÃO FOLHAS
    // ============================

    const larguraFolha =
      largura /
      quantidadeFolhas;


    // ============================
    // ÁREA VIDRO
    // ============================

    const areaVidro =
      (
        (largura / 1000) *
        (altura / 1000)
      );


    // ============================
    // KG ALUMÍNIO
    // ============================

    const pesoLinear =
      linha === "Gold"
        ? 1.5
        : 1.2;


    const perimetro =
      (
        largura * 2 +
        altura * 2
      ) / 1000;


    const kgAluminio =
      perimetro *
      pesoLinear;


    // ============================
    // VALORES
    // ============================

    const valorPerfis =
      kgAluminio *
      valorKg;

    const valorTotalVidro =
      areaVidro *
      valorVidro;

    const valorTotalAcessorios =
      quantidadeFolhas *
      valorAcessorios;

    const total =
      valorPerfis +
      valorTotalVidro +
      valorTotalAcessorios;


    // ============================
    // LISTA DE CORTE
    // ============================

    const listaCorte = [

      {
        perfil:
          "Marco Superior",
        medida:
          largura
      },

      {
        perfil:
          "Marco Inferior",
        medida:
          largura
      },

      {
        perfil:
          "Marco Lateral",
        medida:
          altura
      },

      {
        perfil:
          "Folha Vertical",
        medida:
          altura
      },

      {
        perfil:
          "Folha Horizontal",
        medida:
          larguraFolha
      }

    ];


    // ============================

    return {

      larguraFolha,

      areaVidro,

      kgAluminio,

      valorPerfis,

      valorTotalVidro,

      valorTotalAcessorios,

      total,

      listaCorte

    };

  }, [
    largura,
    altura,
    quantidadeFolhas,
    linha,
    valorKg,
    valorVidro,
    valorAcessorios
  ]);


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
        Tipologia Inteligente
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Motor industrial automático
      </p>


      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "420px 1fr",
          gap: 20
        }}
      >

        {/* FORMULÁRIO */}

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 15
          }}
        >

          <h2>
            Configuração
          </h2>


          <label>
            Nome
          </label>

          <input
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            style={styles.input}
          />


          <label>
            Linha
          </label>

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


          <label>
            Largura
          </label>

          <input
            type="number"
            value={largura}
            onChange={(e) =>
              setLargura(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />


          <label>
            Altura
          </label>

          <input
            type="number"
            value={altura}
            onChange={(e) =>
              setAltura(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />


          <label>
            Quantidade folhas
          </label>

          <input
            type="number"
            value={
              quantidadeFolhas
            }
            onChange={(e) =>
              setQuantidadeFolhas(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />


          <label>
            Alumínio R$/kg
          </label>

          <input
            type="number"
            value={valorKg}
            onChange={(e) =>
              setValorKg(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />


          <label>
            Vidro R$/m²
          </label>

          <input
            type="number"
            value={valorVidro}
            onChange={(e) =>
              setValorVidro(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />


          <label>
            Acessórios
          </label>

          <input
            type="number"
            value={
              valorAcessorios
            }
            onChange={(e) =>
              setValorAcessorios(
                Number(
                  e.target.value
                )
              )
            }
            style={styles.input}
          />

        </div>


        {/* RESULTADO */}

        <div
          style={{
            display: "grid",
            gap: 20
          }}
        >

          {/* DESENHO */}

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 15
            }}
          >

            <h2>
              Desenho Técnico
            </h2>

            <div
              style={{
                height: 420,
                border:
                  "2px solid #0f172a",
                display: "grid",
                gridTemplateColumns:
                  `repeat(${quantidadeFolhas},1fr)`,
                gap: 5,
                padding: 10
              }}
            >

              {Array.from({
                length:
                  quantidadeFolhas
              }).map((_, i) => (

                <div
                  key={i}
                  style={{
                    border:
                      "2px solid #0f172a",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    background:
                      "#dbeafe"
                  }}
                >

                  Folha {i + 1}

                </div>

              ))}

            </div>

          </div>


          {/* RESUMO */}

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 15
            }}
          >

            <h2>
              Resumo Industrial
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                gap: 15
              }}
            >

              <Card
                titulo="Área vidro"
                valor={
                  calculo.areaVidro.toFixed(2) +
                  " m²"
                }
              />

              <Card
                titulo="Kg alumínio"
                valor={
                  calculo.kgAluminio.toFixed(2) +
                  " kg"
                }
              />

              <Card
                titulo="Folha"
                valor={
                  calculo.larguraFolha.toFixed(0) +
                  " mm"
                }
              />

              <Card
                titulo="Total"
                valor={
                  "R$ " +
                  calculo.total.toFixed(2)
                }
              />

            </div>

          </div>


          {/* LISTA CORTE */}

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 15
            }}
          >

            <h2>
              Lista de Corte
            </h2>

            {calculo.listaCorte.map(
              (item, index) => (

                <div
                  key={index}
                  style={{
                    padding: 12,
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  {item.perfil}
                  {" - "}
                  {item.medida}
                  mm

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );

}


// ====================================
// CARD
// ====================================

function Card({
  titulo,
  valor
}) {

  return (

    <div
      style={{
        background: "#f8fafc",
        padding: 20,
        borderRadius: 15
      }}
    >

      <p>
        {titulo}
      </p>

      <h2>
        {valor}
      </h2>

    </div>

  );

}


// ====================================
// ESTILOS
// ====================================

const styles = {

  input: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    marginBottom: 15,
    borderRadius: 10,
    border:
      "1px solid #ccc"
  }

};