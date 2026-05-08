import React, {
  useMemo,
  useState
} from "react";

export default function FormulasTipologia() {

  // ====================================
  // ESTADOS
  // ====================================

  const [tipologia, setTipologia] =
    useState(
      "Janela 2 Folhas"
    );

  const [formulaPerfis,
    setFormulaPerfis] =
    useState(
      "(L*2)+(A*2)"
    );

  const [formulaVidro,
    setFormulaVidro] =
    useState(
      "(L/1000)*(A/1000)"
    );

  const [formulaAcessorios,
    setFormulaAcessorios] =
    useState(
      "2"
    );

  const [largura, setLargura] =
    useState(1200);

  const [altura, setAltura] =
    useState(1000);

  const [valorKg, setValorKg] =
    useState(45);

  const [valorVidro, setValorVidro] =
    useState(120);

  const [valorAcessorio,
    setValorAcessorio] =
    useState(50);


  // ====================================
  // EXECUTAR FÓRMULA
  // ====================================

  const executarFormula = (
    formula
  ) => {

    try {

      const L =
        Number(largura);

      const A =
        Number(altura);

      return eval(formula);

    } catch {

      return 0;

    }

  };


  // ====================================
  // CÁLCULO
  // ====================================

  const resultado =
    useMemo(() => {

      const perfis =
        executarFormula(
          formulaPerfis
        );

      const vidro =
        executarFormula(
          formulaVidro
        );

      const acessorios =
        executarFormula(
          formulaAcessorios
        );

      const valorPerfis =
        perfis *
        valorKg;

      const valorTotalVidro =
        vidro *
        valorVidro;

      const valorTotalAcessorios =
        acessorios *
        valorAcessorio;

      const total =
        valorPerfis +
        valorTotalVidro +
        valorTotalAcessorios;

      return {

        perfis,

        vidro,

        acessorios,

        valorPerfis,

        valorTotalVidro,

        valorTotalAcessorios,

        total

      };

    }, [

      largura,
      altura,

      formulaPerfis,
      formulaVidro,
      formulaAcessorios,

      valorKg,
      valorVidro,
      valorAcessorio

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
        Fórmulas Dinâmicas
      </h1>

      <p
        style={{
          marginBottom: 30
        }}
      >
        Motor configurável industrial
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

        {/* CONFIG */}

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
            Tipologia
          </label>

          <input
            value={tipologia}
            onChange={(e) =>
              setTipologia(
                e.target.value
              )
            }
            style={styles.input}
          />


          <label>
            Largura (L)
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
            Altura (A)
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
            Fórmula Perfis
          </label>

          <textarea
            value={
              formulaPerfis
            }
            onChange={(e) =>
              setFormulaPerfis(
                e.target.value
              )
            }
            style={
              styles.textarea
            }
          />


          <label>
            Fórmula Vidro
          </label>

          <textarea
            value={
              formulaVidro
            }
            onChange={(e) =>
              setFormulaVidro(
                e.target.value
              )
            }
            style={
              styles.textarea
            }
          />


          <label>
            Fórmula Acessórios
          </label>

          <textarea
            value={
              formulaAcessorios
            }
            onChange={(e) =>
              setFormulaAcessorios(
                e.target.value
              )
            }
            style={
              styles.textarea
            }
          />


          <label>
            Valor Kg
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
            Valor Vidro
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
            Valor Acessório
          </label>

          <input
            type="number"
            value={
              valorAcessorio
            }
            onChange={(e) =>
              setValorAcessorio(
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

          <Card
            titulo="Perfis"
            valor={
              resultado.perfis.toFixed(
                2
              )
            }
          />

          <Card
            titulo="Vidro"
            valor={
              resultado.vidro.toFixed(
                2
              )
            }
          />

          <Card
            titulo="Acessórios"
            valor={
              resultado.acessorios.toFixed(
                2
              )
            }
          />

          <Card
            titulo="Valor Perfis"
            valor={
              "R$ " +
              resultado.valorPerfis.toFixed(
                2
              )
            }
          />

          <Card
            titulo="Valor Vidro"
            valor={
              "R$ " +
              resultado.valorTotalVidro.toFixed(
                2
              )
            }
          />

          <Card
            titulo="Valor Acessórios"
            valor={
              "R$ " +
              resultado.valorTotalAcessorios.toFixed(
                2
              )
            }
          />

          <Card
            titulo="TOTAL"
            valor={
              "R$ " +
              resultado.total.toFixed(
                2
              )
            }
          />

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
        background: "#fff",
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
  },

  textarea: {
    width: "100%",
    minHeight: 80,
    padding: 12,
    marginTop: 8,
    marginBottom: 15,
    borderRadius: 10,
    border:
      "1px solid #ccc"
  }

};