import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:3001";

export default function FachadaCompletaPDF() {
  const [fachadas, setFachadas] = useState([]);
  const [fachadaId, setFachadaId] = useState("");
  const [dados, setDados] = useState(null);

  const pdfTecnicoRef = useRef(null);
  const pdfMateriaisRef = useRef(null);
  const pdfCorteRef = useRef(null);

  useEffect(() => {
    carregarFachadas();
  }, []);

  async function carregarFachadas() {
    const res = await fetch(`${API}/fachadas`);
    const data = await res.json();
    setFachadas(Array.isArray(data) ? data : []);
  }

  async function gerarTudo() {
    if (!fachadaId) {
      alert("Selecione uma fachada");
      return;
    }

    const res = await fetch(`${API}/fachadas/${fachadaId}/gerar-materiais`, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao gerar fachada completa");
      return;
    }

    setDados(data);
  }

  async function gerarPDF(ref, nome) {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const margem = 10;
    const imgWidth = pdfWidth - margem * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margem;

    pdf.addImage(imgData, "PNG", margem, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - margem * 2);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margem;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margem, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - margem * 2);
    }

    pdf.save(nome);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Fachada Completa → Materiais + PDF Técnico</h1>

      <div style={box}>
        <select
          value={fachadaId}
          onChange={(e) => setFachadaId(e.target.value)}
          style={input}
        >
          <option value="">Selecione a fachada</option>
          {fachadas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>

        <button onClick={gerarTudo} style={button}>
          Gerar Materiais da Fachada
        </button>
      </div>

      {dados && (
        <>
          <div ref={pdfTecnicoRef} style={box}>
            <h2>PDF Técnico da Fachada</h2>
            <div><strong>Fachada:</strong> {dados.fachada.nome}</div>
            <div><strong>Largura total:</strong> {dados.fachada.largura_total_mm} mm</div>
            <div><strong>Altura total:</strong> {dados.fachada.altura_total_mm} mm</div>
            <div><strong>Total materiais:</strong> R$ {Number(dados.total_materiais).toFixed(2)}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button onClick={() => gerarPDF(pdfTecnicoRef, `fachada-tecnica-${dados.fachada.id}.pdf`)}>
              PDF Técnico
            </button>
          </div>

          <div ref={pdfMateriaisRef} style={box}>
            <h2>PDF de Materiais da Fachada</h2>

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Qtd</th>
                  <th>Medida</th>
                  <th>Metros/Área</th>
                  <th>Peso</th>
                  <th>Custo</th>
                </tr>
              </thead>
              <tbody>
                {dados.materiais.map((item, i) => (
                  <tr key={i}>
                    <td>{item.modulo_id}</td>
                    <td>{item.tipo_item}</td>
                    <td>{item.descricao}</td>
                    <td>{item.quantidade}</td>
                    <td>
                      {item.comprimento_mm
                        ? `${item.comprimento_mm} mm`
                        : item.largura_mm
                        ? `${item.largura_mm} x ${item.altura_mm} mm`
                        : "-"}
                    </td>
                    <td>{item.metros || item.area || "-"}</td>
                    <td>{item.peso_kg || "-"}</td>
                    <td>R$ {Number(item.custo || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button onClick={() => gerarPDF(pdfMateriaisRef, `fachada-materiais-${dados.fachada.id}.pdf`)}>
              PDF Materiais
            </button>
          </div>

          <div ref={pdfCorteRef} style={box}>
            <h2>PDF Lista de Corte</h2>

            <h3>Peças agrupadas</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: 20 }}>
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Descrição</th>
                  <th>Comprimento</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {dados.pecas_agrupadas.map((p, i) => (
                  <tr key={i}>
                    <td>{p.perfil_nome}</td>
                    <td>{p.descricao}</td>
                    <td>{p.comprimento_mm} mm</td>
                    <td>{p.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Plano de corte</h3>
            {dados.corte.map((grupo, i) => (
              <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12 }}>
                <strong>{grupo.perfil_nome}</strong>
                {grupo.barras.map((barra, idx) => (
                  <div key={idx} style={{ marginTop: 10 }}>
                    <div>
                      Barra {idx + 1} - {barra.comprimento_barra_mm} mm - sobra {barra.sobra_mm} mm
                    </div>
                    <ul>
                      {barra.pecas.map((peca, pidx) => (
                        <li key={pidx}>
                          {peca.descricao} - {peca.comprimento_mm} mm
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <button onClick={() => gerarPDF(pdfCorteRef, `fachada-corte-${dados.fachada.id}.pdf`)}>
              PDF Corte
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const box = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  marginBottom: 20
};

const input = {
  padding: 10,
  marginRight: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  minWidth: 260
};

const button = {
  padding: "10px 14px",
  border: "none",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer"
};