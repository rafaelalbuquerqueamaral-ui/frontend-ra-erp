import React from "react";

export default function PdfOrcamentoPro({
  resultado,
}) {
  if (!resultado) return null;

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
    <div className="pdf-area">
      <div className="pdf-header">
        <div>
          <h1>R&A VIDROS</h1>

          <p>
            ERP Industrial de
            Esquadrias
          </p>
        </div>

        <div>
          <h2>
            ORÇAMENTO TÉCNICO
          </h2>

          <p>
            {new Date().toLocaleDateString(
              "pt-BR"
            )}
          </p>
        </div>
      </div>

      <div className="pdf-box">
        <h3>
          Dados da Tipologia
        </h3>

        <div className="pdf-grid">
          <div>
            <strong>
              Tipologia
            </strong>

            <p>
              {
                resultado.tipologia
              }
            </p>
          </div>

          <div>
            <strong>linha</strong>

            <p>
              {resultado.linha}
            </p>
          </div>

          <div>
            <strong>
              Largura
            </strong>

            <p>
              {
                resultado.largura
              }{" "}
              mm
            </p>
          </div>

          <div>
            <strong>Altura</strong>

            <p>
              {
                resultado.altura
              }{" "}
              mm
            </p>
          </div>

          <div>
            <strong>Área</strong>

            <p>
              {Number(
                resultado.area
              ).toFixed(2)}{" "}
              m²
            </p>
          </div>

          <div>
            <strong>
              Peso Alumínio
            </strong>

            <p>
              {Number(
                resultado.totalPesoAluminio
              ).toFixed(3)}{" "}
              kg
            </p>
          </div>
        </div>
      </div>

      <div className="pdf-box">
        <h3>
          Perfis Calculados
        </h3>

        <table className="pdf-table">
          <thead>
            <tr>
              <th>Perfil</th>

              <th>Qtd</th>

              <th>
                Fórmula
              </th>

              <th>
                Medida
              </th>

              <th>Peso</th>

              <th>Custo</th>
            </tr>
          </thead>

          <tbody>
            {resultado.listaPerfis?.map(
              (
                p,
                index
              ) => (
                <tr key={index}>
                  <td>
                    {p.nome}
                  </td>

                  <td>
                    {
                      p.quantidade
                    }
                  </td>

                  <td>
                    {p.formula}
                  </td>

                  <td>
                    {Number(
                      p.medida_metro
                    ).toFixed(2)}{" "}
                    m
                  </td>

                  <td>
                    {Number(
                      p.peso_total
                    ).toFixed(3)}{" "}
                    kg
                  </td>

                  <td>
                    {dinheiro(
                      p.custo_aluminio +
                        p.custo_pintura
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="pdf-box">
        <h3>Acessórios</h3>

        <table className="pdf-table">
          <thead>
            <tr>
              <th>
                Acessório
              </th>

              <th>Qtd</th>

              <th>
                Unitário
              </th>

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {resultado.listaAcessorios?.map(
              (
                a,
                index
              ) => (
                <tr key={index}>
                  <td>
                    {a.nome}
                  </td>

                  <td>
                    {
                      a.quantidade
                    }
                  </td>

                  <td>
                    {dinheiro(
                      a.preco_unitario
                    )}
                  </td>

                  <td>
                    {dinheiro(
                      a.total
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="pdf-resumo">
        <div>
          <span>
            Alumínio
          </span>

          <strong>
            {dinheiro(
              resultado.totalAluminio
            )}
          </strong>
        </div>

        <div>
          <span>
            Pintura
          </span>

          <strong>
            {dinheiro(
              resultado.totalPintura
            )}
          </strong>
        </div>

        <div>
          <span>Vidro</span>

          <strong>
            {dinheiro(
              resultado.totalVidro
            )}
          </strong>
        </div>

        <div>
          <span>
            Acessórios
          </span>

          <strong>
            {dinheiro(
              resultado.totalAcessorios
            )}
          </strong>
        </div>

        <div className="pdf-total">
          <span>
            VENDA FINAL
          </span>

          <strong>
            {dinheiro(
              resultado.vendaTotal
            )}
          </strong>
        </div>
      </div>

      <div className="pdf-footer">
        <p>
          R&A VIDROS E
          ESQUADRIAS
        </p>

        <p>
          Documento técnico
          gerado pelo ERP
          Industrial
        </p>
      </div>
    </div>
  );
}