import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function letraLinha(index) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letras[index] || `L${index + 1}`;
}

export default function OrcamentoFachadaPDF() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`http://localhost:3001/orcamentos-fachada/${id}`);
        const data = await res.json();
        setDados(data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar orçamento");
      }
    }

    carregar();
  }, [id]);

  async function gerarPDF() {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pageHeight = 297;
    const margin = 6;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(`orcamento-fachada-${id}.pdf`);
  }

  if (!dados) {
    return <div style={{ padding: 20 }}>Carregando orçamento...</div>;
  }

  const grade = Array.isArray(dados?.grade) ? dados.grade : [];
  const itensOrcamento = Array.isArray(dados?.itensOrcamento) ? dados.itensOrcamento : [];
  const materiais = Array.isArray(dados?.materiais) ? dados.materiais : [];

  const qtdX = Number(dados?.qtdX || 1);
  const qtdY = Number(dados?.qtdY || 1);

  const margemEsq = 30;
  const margemTop = 20;
  const larguraDesenho = 210;
  const alturaDesenho = 250;
  const cw = larguraDesenho / qtdX;
  const ch = alturaDesenho / qtdY;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <button onClick={gerarPDF}>Gerar PDF</button>
      <button onClick={() => navigate("/fachadas")} style={{ marginLeft: 8 }}>
        Voltar
      </button>

      <div
        ref={pdfRef}
        style={{
          width: 920,
          margin: "20px auto",
          background: "#fff",
          border: "1px solid #ddd",
          padding: 20,
          color: "#000",
        }}
      >
        <div style={{ borderBottom: "2px solid #111827", paddingBottom: 10, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: "bold" }}>R&A VIDROS E ESQUADRIAS</div>
              <div style={{ fontSize: 12 }}>ORÇAMENTO AUTOMÁTICO DE FACHADA</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div><strong>Orçamento:</strong> {dados.id}</div>
              <div><strong>Data:</strong> {new Date(dados.criadoEm).toLocaleDateString("pt-BR")}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: 20, marginBottom: 20 }}>
          <div>
            <div><strong>Projeto:</strong> {dados.nome}</div>
            <div><strong>Largura:</strong> {dados.largura} mm</div>
            <div><strong>Altura:</strong> {dados.altura} mm</div>
            <div><strong>Área:</strong> {dados.areaTotal} m²</div>
          </div>

          <div style={{ border: "2px solid #111827", padding: 14, textAlign: "center" }}>
            <div style={{ fontWeight: "bold" }}>VALOR TOTAL</div>
            <div style={{ fontSize: 30, fontWeight: "bold", marginTop: 10 }}>
              {moeda(dados.valorTotal)}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ border: "1px solid #cbd5e1", padding: 10 }}>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Desenho da Fachada</div>

            <svg width="270" height="290">
              <rect
                x={margemEsq}
                y={margemTop}
                width={larguraDesenho}
                height={alturaDesenho}
                fill="#fff"
                stroke="#111827"
              />

              {grade.map((linha, row) =>
                (Array.isArray(linha) ? linha : []).map((cel, col) => {
                  if (!cel || cel.hidden || cel.master === false) return null;

                  const x = margemEsq + col * cw;
                  const y = margemTop + row * ch;
                  const w = cw * (cel.colSpan || 1);
                  const h = ch * (cel.rowSpan || 1);

                  return (
                    <g key={`${row}-${col}`}>
                      <rect x={x} y={y} width={w} height={h} fill="#f8fafc" stroke="#111827" />
                      <text x={x + 4} y={y + 12} fontSize="8">
                        {letraLinha(row)}{col + 1}
                      </text>
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          <div>
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Itens do Orçamento</div>

            <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ padding: 6 }}>Código</th>
                  <th style={{ padding: 6 }}>Tipologia</th>
                  <th style={{ padding: 6 }}>Largura</th>
                  <th style={{ padding: 6 }}>Altura</th>
                  <th style={{ padding: 6 }}>Qtd</th>
                  <th style={{ padding: 6 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {itensOrcamento.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: 8, textAlign: "center" }}>
                      Nenhum item no orçamento
                    </td>
                  </tr>
                ) : (
                  itensOrcamento.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: 6 }}>{item.codigo}</td>
                      <td style={{ padding: 6 }}>{item.tipologia}</td>
                      <td style={{ padding: 6, textAlign: "center" }}>{item.largura}</td>
                      <td style={{ padding: 6, textAlign: "center" }}>{item.altura}</td>
                      <td style={{ padding: 6, textAlign: "center" }}>{item.quantidade}</td>
                      <td style={{ padding: 6, textAlign: "right" }}>{moeda(item.valorTotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Materiais Totais da Fachada</div>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 6 }}>Categoria</th>
                <th style={{ padding: 6 }}>Código</th>
                <th style={{ padding: 6 }}>Nome</th>
                <th style={{ padding: 6 }}>Quantidade</th>
                <th style={{ padding: 6 }}>Unidade</th>
                <th style={{ padding: 6 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {materiais.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 8, textAlign: "center" }}>
                    Nenhum material calculado
                  </td>
                </tr>
              ) : (
                materiais.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: 6 }}>{item.categoria}</td>
                    <td style={{ padding: 6 }}>{item.codigo}</td>
                    <td style={{ padding: 6 }}>{item.nome}</td>
                    <td style={{ padding: 6, textAlign: "center" }}>{item.quantidade}</td>
                    <td style={{ padding: 6, textAlign: "center" }}>{item.unidade}</td>
                    <td style={{ padding: 6, textAlign: "right" }}>{moeda(item.valor)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}