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

  if (sub.tipo === "FIXO") return <rect x={sx} y={sy} width={sw} height={sh} fill="#d9f99d" stroke="#111827" />;
  if (sub.tipo === "MAX") {
    return (
      <g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="#f8fafc" stroke="#111827" />
        <line x1={sx + sw * 0.15} y1={sy + sh * 0.2} x2={sx + sw * 0.5} y2={sy + sh * 0.82} stroke="#60a5fa" strokeWidth="1.3" strokeDasharray="4,3" />
        <line x1={sx + sw * 0.85} y1={sy + sh * 0.2} x2={sx + sw * 0.5} y2={sy + sh * 0.82} stroke="#60a5fa" strokeWidth="1.3" strokeDasharray="4,3" />
      </g>
    );
  }
  if (sub.tipo === "BANDEIRA") return <rect x={sx} y={sy} width={sw} height={sh} fill="#e0f2fe" stroke="#111827" />;
  if (sub.tipo === "PORTA") {
    return (
      <g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="#fff" stroke="#111827" />
        <circle cx={sx + sw * 0.72} cy={sy + sh * 0.52} r="2" fill="#111827" />
      </g>
    );
  }
  return <rect x={sx} y={sy} width={sw} height={sh} fill="#fff" stroke="#111827" />;
}

export default function FachadaPranchaTecnica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fachada, setFachada] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/fachadas/${id}`);
      const data = await res.json();
      setFachada(data);
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
    const margin = 8;
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

    pdf.save(`prancha-fachada-${id}.pdf`);
  }

  if (!fachada) return <div style={{ padding: "20px" }}>Carregando prancha...</div>;

  const qtdX = Number(fachada.qtdX || 1);
  const qtdY = Number(fachada.qtdY || 1);
  const largura = Number(fachada.largura || 0);
  const altura = Number(fachada.altura || 0);
  const grade = Array.isArray(fachada.grade) ? fachada.grade : [];

  const margemEsq = 80;
  const margemTop = 70;
  const larguraDesenho = 520;
  const alturaDesenho = 620;
  const cw = larguraDesenho / qtdX;
  const ch = alturaDesenho / qtdY;
  const larguraModulo = Math.round(largura / qtdX);
  const alturaModulo = Math.round(altura / qtdY);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={gerarPDF}>Gerar PDF Técnico</button>
      <button onClick={() => navigate("/fachadas")} style={{ marginLeft: "10px" }}>
        Voltar
      </button>

      <div
        ref={pdfRef}
        style={{
          width: "900px",
          margin: "20px auto",
          background: "#fff",
          border: "1px solid #ddd",
          padding: "20px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>PRANCHA TÉCNICA DA FACHADA</h1>
        <p><strong>Nome:</strong> {fachada.nome}</p>
        <p><strong>Largura:</strong> {fachada.largura} mm | <strong>Altura:</strong> {fachada.altura} mm</p>

        <svg width="760" height="760">
          <rect x={margemEsq} y={margemTop} width={larguraDesenho} height={alturaDesenho} fill="#fff" stroke="#111827" />

          {Array.from({ length: qtdY }).map((_, row) => (
            <text
              key={row}
              x="40"
              y={margemTop + row * ch + ch / 2 + 4}
              fontSize="13"
            >
              {letraLinha(row)}
            </text>
          ))}

          {Array.from({ length: qtdX }).map((_, col) => (
            <text
              key={col}
              x={margemEsq + col * cw + cw / 2}
              y={margemTop + alturaDesenho + 26}
              textAnchor="middle"
              fontSize="13"
            >
              {col + 1}
            </text>
          ))}

          {Array.from({ length: qtdX }).map((_, col) => (
            <g key={`cx-${col}`}>
              <text x={margemEsq + col * cw + cw / 2} y="48" textAnchor="middle" fontSize="12">
                {larguraModulo}
              </text>
              <line x1={margemEsq + col * cw} y1="54" x2={margemEsq + (col + 1) * cw} y2="54" stroke="#111827" />
            </g>
          ))}

          {Array.from({ length: qtdY }).map((_, row) => (
            <g key={`cy-${row}`}>
              <text x="628" y={margemTop + row * ch + ch / 2 + 4} fontSize="12">
                {alturaModulo}
              </text>
              <line x1="612" y1={margemTop + row * ch} x2="612" y2={margemTop + (row + 1) * ch} stroke="#111827" />
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
                  {(cel.subdivisoes || [{ tipo: "VAZIO", x: 0, y: 0, w: 1, h: 1 }]).map((sub, index) => (
                    <g key={index}>{desenharSubdivisao(sub, x, y, w, h)}</g>
                  ))}
                  <rect x={x} y={y} width={w} height={h} fill="transparent" stroke="#111827" />
                  <text x={x + 4} y={y + 14} fontSize="10">{letraLinha(row)}{col + 1}</text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}