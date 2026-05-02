import React from "react";
import "./FachadaPDF.css";

export default function FachadaPDF({
  nome,
  colunas,
  linhas,
  grade,
  larguraTotal,
  alturaTotal,
  areaTotal,
  materiais,
}) {
  return (
    <div className="pdf-fachada-executiva">
      <div className="pdf-cabecalho">
        <div>
          <h1>R&A VIDROS E ESQUADRIAS</h1>
          <p>PRANCHA EXECUTIVA DE FACHADA</p>
        </div>

        <div className="pdf-numero">
          <strong>REV. 00</strong>
          <span>{new Date().toLocaleDateString("pt-BR")}</span>
        </div>
      </div>

      <div className="pdf-info">
        <div>
          <strong>Projeto:</strong> {nome}
        </div>

        <div>
          <strong>Largura:</strong> {larguraTotal} mm
        </div>

        <div>
          <strong>Altura:</strong> {alturaTotal} mm
        </div>

        <div>
          <strong>Área:</strong> {areaTotal} m²
        </div>
      </div>

      <div className="pdf-prancha-area">
        <div className="pdf-cotas-topo">
          {colunas.map((c, i) => (
            <div key={i}>{c.largura} mm</div>
          ))}
        </div>

        <div className="pdf-desenho-wrapper">
          <div className="pdf-cotas-lateral">
            {linhas.map((l, i) => (
              <div key={i}>{l.altura} mm</div>
            ))}
          </div>

          <div
            className="pdf-grade"
            style={{
              gridTemplateColumns: colunas.map(() => "95px").join(" "),
            }}
          >
            {grade.map((linha, row) =>
              linha.map((modulo, col) => (
                <div key={`${row}-${col}`} className="pdf-modulo">
                  <span className="pdf-tipo">{modulo.tipo}</span>

                  <strong className="pdf-tipologia">
                    {modulo.tipologia || "SEM TIPOLOGIA"}
                  </strong>

                  <span className="pdf-linha">{modulo.linha}</span>

                  {modulo.subdivisoes?.map((s, i) => (
                    <div key={i} className="pdf-subdivisao">
                      {s.tipo}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pdf-tabelas">
        <div className="pdf-box">
          <h3>Resumo Técnico</h3>

          <table>
            <tbody>
              <tr>
                <td>Largura total</td>
                <td>{larguraTotal} mm</td>
              </tr>

              <tr>
                <td>Altura total</td>
                <td>{alturaTotal} mm</td>
              </tr>

              <tr>
                <td>Área total</td>
                <td>{areaTotal} m²</td>
              </tr>

              <tr>
                <td>Quantidade de módulos</td>
                <td>{grade.flat().length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pdf-box">
          <h3>Materiais Previstos</h3>

          <table>
            <tbody>
              <tr>
                <td>Perfis estimados</td>
                <td>{materiais.aluminio} m</td>
              </tr>

              <tr>
                <td>Vidro estimado</td>
                <td>{materiais.vidro} m²</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="pdf-carimbo">
        <div>
          <strong>Cliente</strong>
          <span>____________________________</span>
        </div>

        <div>
          <strong>Responsável Técnico</strong>
          <span>____________________________</span>
        </div>

        <div>
          <strong>Empresa</strong>
          <span>R&A VIDROS E ESQUADRIAS</span>
        </div>
      </div>
    </div>
  );
}