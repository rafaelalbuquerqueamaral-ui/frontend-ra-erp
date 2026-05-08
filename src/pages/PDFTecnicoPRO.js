import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PDFTecnicoPRO() {

  // ====================================
  // GERAR PDF
  // ====================================

  const gerarPDF = async () => {

    const elemento =
      document.getElementById(
        "pdf-area"
      );

    const canvas =
      await html2canvas(
        elemento,
        {
          scale: 2
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf =
      new jsPDF(
        "landscape",
        "mm",
        "a4"
      );

    const largura =
      pdf.internal.pageSize.getWidth();

    const altura =
      pdf.internal.pageSize.getHeight();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      largura,
      altura
    );

    pdf.save(
      "PDF_TECNICO_PRO.pdf"
    );

  };


  // ====================================

  return (

    <div
      style={{
        padding: 30,
        background: "#e2e8f0",
        minHeight: "100vh"
      }}
    >

      <button
        onClick={gerarPDF}
        style={styles.botao}
      >
        Gerar PDF Técnico
      </button>


      {/* ÁREA PDF */}

      <div
        id="pdf-area"
        style={styles.prancha}
      >

        {/* CABEÇALHO */}

        <div
          style={styles.topo}
        >

          <div>

            <h1
              style={{
                margin: 0
              }}
            >
              R&A VIDROS
            </h1>

            <p>
              Sistema ERP Industrial
            </p>

          </div>


          <div
            style={{
              textAlign: "right"
            }}
          >

            <h2>
              PDF Técnico
            </h2>

            <p>
              Projeto Industrial
            </p>

          </div>

        </div>


        {/* DADOS */}

        <div
          style={styles.infoGrid}
        >

          <Info
            titulo="Cliente"
            valor="Cliente Exemplo"
          />

          <Info
            titulo="Obra"
            valor="Obra Exemplo"
          />

          <Info
            titulo="Linha"
            valor="Suprema"
          />

          <Info
            titulo="Data"
            valor={
              new Date()
                .toLocaleDateString()
            }
          />

        </div>


        {/* DESENHO */}

        <div
          style={styles.bloco}
        >

          <h2>
            Fachada Técnica
          </h2>

          <div
            style={styles.fachada}
          >

            {Array.from({
              length: 8
            }).map((_, i) => (

              <div
                key={i}
                style={
                  styles.modulo
                }
              >

                Módulo
                {" "}
                {i + 1}

              </div>

            ))}

          </div>

        </div>


        {/* LISTAS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 20
          }}
        >

          {/* CORTE */}

          <div
            style={styles.bloco}
          >

            <h2>
              Lista de Corte
            </h2>

            {[
              1200,
              950,
              840,
              760,
              1200,
              550
            ].map((m, i) => (

              <Linha
                key={i}
                nome={`Perfil ${i + 1}`}
                valor={`${m} mm`}
              />

            ))}

          </div>


          {/* VIDROS */}

          <div
            style={styles.bloco}
          >

            <h2>
              Lista de Vidros
            </h2>

            {[
              "1200 x 1000",
              "800 x 600",
              "550 x 400"
            ].map((m, i) => (

              <Linha
                key={i}
                nome={`Vidro ${i + 1}`}
                valor={m}
              />

            ))}

          </div>

        </div>


        {/* OBS */}

        <div
          style={styles.bloco}
        >

          <h2>
            Observações Técnicas
          </h2>

          <p>

            Projeto técnico industrial
            integrado ao ERP de
            esquadrias de alumínio.

          </p>

        </div>


        {/* RODAPÉ */}

        <div
          style={styles.rodape}
        >

          <div>

            ____________________

            <p>
              Responsável Técnico
            </p>

          </div>


          <div>

            Página 1

          </div>

        </div>

      </div>

    </div>

  );

}


// ====================================
// INFO
// ====================================

function Info({
  titulo,
  valor
}) {

  return (

    <div
      style={{
        background: "#f8fafc",
        padding: 15,
        borderRadius: 10
      }}
    >

      <strong>
        {titulo}
      </strong>

      <p>
        {valor}
      </p>

    </div>

  );

}


// ====================================
// LINHA
// ====================================

function Linha({
  nome,
  valor
}) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        padding: 10,
        borderBottom:
          "1px solid #eee"
      }}
    >

      <span>
        {nome}
      </span>

      <strong>
        {valor}
      </strong>

    </div>

  );

}


// ====================================
// ESTILOS
// ====================================

const styles = {

  botao: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding:
      "14px 24px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 20
  },

  prancha: {
    background: "#fff",
    padding: 30,
    width: 1400,
    margin: "0 auto"
  },

  topo: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 30
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: 15,
    marginBottom: 30
  },

  bloco: {
    background: "#fff",
    border:
      "1px solid #ddd",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20
  },

  fachada: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: 10
  },

  modulo: {
    height: 180,
    border:
      "2px solid #0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    background: "#dbeafe",
    fontWeight: "bold"
  },

  rodape: {
    display: "flex",
    justifyContent:
      "space-between",
    marginTop: 40
  }

};