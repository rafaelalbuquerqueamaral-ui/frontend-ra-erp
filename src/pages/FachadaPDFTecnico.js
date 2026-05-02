import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function letraLinha(index) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letras[index] || `L${index + 1}`;
}

function desenharSubdivisao(sub, x, y, w, h) {
  const sx = x + w * sub.x;
  const sy = y + h * sub.y;
  const sw = w * sub.w;
  const sh = h * sub.h;

  if (sub.tipo === "FIXO") {
    return <rect x={sx} y={sy} width={sw} height={sh} fill="#d9f99d" stroke="#111827" />;
  }

  if (sub.tipo === "MAX") {
    return (
      <g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="#f8fafc" stroke="#111827" />
        <line
          x1={sx + sw * 0.15}
          y1={sy + sh * 0.2}
          x2={sx + sw * 0.5}
          y2={sy + sh * 0.82}
          stroke="#60a5fa"
          strokeWidth="1.2"
          strokeDasharray="4,3"
        />
        <line
          x1={sx + sw * 0.85}
          y1={sy + sh * 0.2}
          x2={sx + sw * 0.5}
          y2={sy + sh * 0.82}
          stroke="#60a5fa"
          strokeWidth="1.2"
          strokeDasharray="4,3"
        />
      </g>
    );
  }

  if (sub.tipo === "BANDEIRA") {
    return <rect x={sx} y={sy} width={sw} height={sh} fill="#e0f2fe" stroke="#111827" />;
  }

  if (sub.tipo === "PORTA") {
    return (
      <g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="#fff" stroke="#111827" />
        <circle cx={sx + sw * 0.75} cy={sy + sh * 0.52} r="2" fill="#111827" />
      </g>
    );
  }

  if (
    sub.tipo === "FOLHA_ESQ" ||
    sub.tipo === "FOLHA_DIR" ||
    sub.tipo === "CORRER_ESQ" ||
    sub.tipo === "CORRER_DIR"
  ) {
    return <rect x={sx} y={sy} width={sw} height={sh} fill="#fff" stroke="#94a3b8" />;
  }

  if (sub.tipo === "NONE") {
    return <rect x={sx} y={sy} width={sw} height={sh} fill="#f3f4f6" stroke="#111827" />;
  }

  if (sub.tipo === "TIPOLOGIA_REAL") {
    return <rect x={sx} y={sy} width={sw} height={sh} fill="#eef2ff" stroke="#111827" />;
  }

  return <rect x={sx} y={sy} width={sw} height={sh} fill="#fff" stroke="#111827" />;
}

export default function FachadaPDFTecnico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fachada, setFachada] = useState(null);
  const [materiais, setMateriais] = useState(null);
  const [corte, setCorte] = useState(null);
  const [memoria, setMemoria] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    async function carregar() {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch(`http://localhost:3001/fachadas/${id}`),
        fetch(`http://localhost:3001/fachadas/${id}/materiais`),
        fetch(`http://localhost:3001/fachadas/${id}/lista-corte`),
        fetch(`http://localhost:3001/fachadas/${id}/memoria-producao`),
      ]);

      const d1 = await r1.json();
      const d2 = await r2.json();
      const d3 = await r3.json();
      const d4 = await r4.json();

      setFachada(d1);
      setMateriais(d2);
      setCorte(d3);
      setMemoria(d4);
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

    pdf.save(`fachada-tecnica-${id}.pdf`);
  }

  if (!fachada || !materiais || !corte || !memoria) {
    return <div style={{ padding: 20 }}>Carregando PDF técnico...</div>;
  }

  const grade = Array.isArray(fachada.grade) ? fachada.grade : [];
  const qtdX = Number(fachada.qtdX || 1);
  const qtdY = Number(fachada.qtdY || 1);
  const largura = Number(fachada.largura || 0);
  const altura = Number(fachada.altura || 0);

  const margemEsq = 70;
  const margemTop = 50;
  const larguraDesenho = 430;
  const alturaDesenho = 430;
  const cw = larguraDesenho / qtdX;
  const ch = alturaDesenho / qtdY;

  const larguraModulo = Math.round(largura / qtdX);
  const alturaModulo = Math.round(altura / qtdY);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <button onClick={gerarPDF}>Gerar PDF Técnico</button>
      <button onClick={() => navigate("/fachadas")} style={{ marginLeft: 10 }}>
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
              <div style={{ fontSize: 12 }}>PDF TÉCNICO INDUSTRIAL DA FACHADA</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div><strong>Fachada:</strong> {fachada.id}</div>
              <div><strong>Data:</strong> {new Date().toLocaleDateString("pt-BR")}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, marginBottom: 20 }}>
          <div>
            <div><strong>Nome:</strong> {fachada.nome}</div>
            <div><strong>Largura:</strong> {fachada.largura} mm</div>
            <div><strong>Altura:</strong> {fachada.altura} mm</div>
            <div><strong>Grade:</strong> {fachada.qtdX} x {fachada.qtdY}</div>
          </div>

          <div style={{ border: "1px solid #111827", padding: 12 }}>
            <div><strong>Área total:</strong> {materiais.areaTotal || 0} m²</div>
            <div><strong>Módulos:</strong> {materiais.totalModulos || 0}</div>
            <div><strong>Valor técnico:</strong> R$ {Number(materiais.valorTotal || 0).toFixed(2)}</div>
          </div>
        </div>

        <div style={{ border: "1px solid #cbd5e1", padding: 12, marginBottom: 20 }}>
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>Elevação Técnica Cotada</div>

          <svg width="620" height="540">
            <rect x={margemEsq} y={margemTop} width={larguraDesenho} height={alturaDesenho} fill="#fff" stroke="#111827" />

            {Array.from({ length: qtdY }).map((_, row) => (
              <text
                key={`y-${row}`}
                x="35"
                y={margemTop + row * ch + ch / 2 + 4}
                fontSize="12"
              >
                {letraLinha(row)}
              </text>
            ))}

            {Array.from({ length: qtdX }).map((_, col) => (
              <text
                key={`x-${col}`}
                x={margemEsq + col * cw + cw / 2}
                y={margemTop + alturaDesenho + 24}
                fontSize="12"
                textAnchor="middle"
              >
                {col + 1}
              </text>
            ))}

            {Array.from({ length: qtdX }).map((_, col) => (
              <g key={`cx-${col}`}>
                <text
                  x={margemEsq + col * cw + cw / 2}
                  y="28"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {larguraModulo}
                </text>
                <line
                  x1={margemEsq + col * cw}
                  y1="34"
                  x2={margemEsq + (col + 1) * cw}
                  y2="34"
                  stroke="#111827"
                />
              </g>
            ))}

            {Array.from({ length: qtdY }).map((_, row) => (
              <g key={`cy-${row}`}>
                <text
                  x="520"
                  y={margemTop + row * ch + ch / 2 + 4}
                  fontSize="11"
                >
                  {alturaModulo}
                </text>
                <line
                  x1="505"
                  y1={margemTop + row * ch}
                  x2="505"
                  y2={margemTop + (row + 1) * ch}
                  stroke="#111827"
                />
              </g>
            ))}

            {grade.map((linha, row) =>
              linha.map((cel, col) => {
                if (!cel || cel.hidden || !cel.master) return null;

                const x = margemEsq + col * cw;
                const y = margemTop + row * ch;
                const w = cw * (cel.colSpan || 1);
                const h = ch * (cel.rowSpan || 1);

                return (
                  <g key={`${row}-${col}`}>
                    {(cel.subdivisoes || [{ tipo: "TIPOLOGIA_REAL", x: 0, y: 0, w: 1, h: 1 }]).map((sub, index) => (
                      <g key={index}>{desenharSubdivisao(sub, x, y, w, h)}</g>
                    ))}

                    <rect x={x} y={y} width={w} height={h} fill="transparent" stroke="#111827" />

                    <text x={x + 3} y={y + 12} fontSize="8">
                      {letraLinha(row)}{col + 1}
                    </text>

                    {cel.tipologiaNome ? (
                      <text x={x + 3} y={y + 23} fontSize="7">
                        {String(cel.tipologiaNome).slice(0, 16)}
                      </text>
                    ) : null}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Memória Técnica</div>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 6 }}>Módulo</th>
                <th style={{ padding: 6 }}>Tipologia</th>
                <th style={{ padding: 6 }}>Linha</th>
                <th style={{ padding: 6 }}>Largura</th>
                <th style={{ padding: 6 }}>Altura</th>
                <th style={{ padding: 6 }}>Obs.</th>
              </tr>
            </thead>
            <tbody>
              {(memoria.memoria || []).map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: 6 }}>{item.modulo}</td>
                  <td style={{ padding: 6 }}>{item.nome}</td>
                  <td style={{ padding: 6 }}>{item.linha || ""}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{item.largura}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{item.altura}</td>
                  <td style={{ padding: 6 }}>{item.observacao || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Lista de Corte Técnica</div>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 6 }}>Código</th>
                <th style={{ padding: 6 }}>Descrição</th>
                <th style={{ padding: 6 }}>Medida</th>
                <th style={{ padding: 6 }}>Qtde</th>
                <th style={{ padding: 6 }}>Corte</th>
              </tr>
            </thead>
            <tbody>
              {(corte.listaCorte || []).map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: 6 }}>{item.codigo}</td>
                  <td style={{ padding: 6 }}>{item.descricao}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{item.medida}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{item.qtde}</td>
                  <td style={{ padding: 6, textAlign: "center" }}>{item.corte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}