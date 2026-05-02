import React from "react";
import "./PdfFachadaPro.css";

export default function PdfFachadaPro({
  colunas,
  linhas,
  grade,
  orcamento,
}) {
  if (!orcamento) return null;

  const larguraTotal = colunas.reduce(
    (a, b) => a + Number(b || 0),
    0
  );

  const alturaTotal = linhas.reduce(
    (a, b) => a + Number(b || 0),
    0
  );

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  return (
    <div id="pdf-fachada" className="pdf-fachada">
      <div className="pdf-header">
        <div>
          <h1>R&A VIDROS E ESQUADRIAS</h1>
          <p>PRANCHA TÉCNICA DE FACHADA</p>
        </div>
      </div>

      <div className="pdf-info">
        <div>
          <strong>Largura:</strong>{" "}
          {larguraTotal} mm
        </div>

        <div>
          <strong>Altura:</strong>{" "}
          {alturaTotal} mm
        </div>

        <div>
          <strong>Área:</strong>{" "}
          {orcamento.areaVidro.toFixed(2)} m²
        </div>
      </div>

      <div className="pdf-prancha">
        <div
          className="pdf-grid"
          style={{
            gridTemplateColumns: colunas
              .map(() => "90px")
              .join(" "),
            gridTemplateRows: linhas
              .map(() => "90px")
              .join(" "),
          }}
        >
          {grade.map((linha, y) =>
            linha.map((modulo, x) => (
              <div
                key={`${x}-${y}`}
                className={`pdf-modulo ${modulo.tipo}`}
              >
                <span>{modulo.tipo}</span>

                <small>
                  {colunas[x]} x {linhas[y]}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pdf-box">
        <h2>Resumo Técnico</h2>

        <table>
          <tbody>
            <tr>
              <td>Área de vidro</td>
              <td>
                {orcamento.areaVidro.toFixed(2)} m²
              </td>
            </tr>

            <tr>
              <td>Metros de perfis</td>
              <td>
                {orcamento.metrosPerfis.toFixed(2)} m
              </td>
            </tr>

            <tr>
              <td>Peso alumínio</td>
              <td>
                {orcamento.pesoAluminio.toFixed(2)} kg
              </td>
            </tr>

            <tr>
              <td>Qtd módulos</td>
              <td>{orcamento.qtdModulos}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pdf-box">
        <h2>Orçamento</h2>

        <table>
          <tbody>
            <tr>
              <td>Vidro</td>
              <td>{dinheiro(orcamento.totalVidro)}</td>
            </tr>

            <tr>
              <td>Alumínio</td>
              <td>{dinheiro(orcamento.totalAluminio)}</td>
            </tr>

            <tr>
              <td>Pintura</td>
              <td>{dinheiro(orcamento.totalPintura)}</td>
            </tr>

            <tr>
              <td>Acessórios</td>
              <td>
                {dinheiro(
                  orcamento.totalAcessorios
                )}
              </td>
            </tr>

            <tr className="total">
              <td>Venda Final</td>
              <td>
                {dinheiro(orcamento.vendaTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pdf-footer">
        <div className="assinatura"></div>
        <p>Assinatura do Cliente</p>
      </div>
    </div>
  );
}