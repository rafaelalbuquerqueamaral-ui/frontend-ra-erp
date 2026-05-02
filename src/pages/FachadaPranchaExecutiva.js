import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API = "http://localhost:3001";

function coletarFolhas(modulos = []) {
  const folhas = [];

  function visitar(lista) {
    for (const m of lista) {
      const temFilhos = Array.isArray(m.children) && m.children.length > 0;
      if (temFilhos) {
        visitar(m.children);
      } else {
        folhas.push(m);
      }
    }
  }

  visitar(modulos);
  return folhas;
}

function nomeTipologia(tipologias, id) {
  const tip = tipologias.find((t) => String(t.id) === String(id));
  return tip ? tip.nome : "Sem tipologia";
}

export default function FachadaPranchaExecutiva() {
  const [fachadas, setFachadas] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [fachadaId, setFachadaId] = useState("");
  const [fachada, setFachada] = useState(null);

  const pranchaRef = useRef(null);

  useEffect(() => {
    carregarBases();
  }, []);

  async function fetchJsonSeguro(url, nomeRota) {
    const res = await fetch(url);
    const text = await res.text();

    try {
      return { ok: res.ok, data: JSON.parse(text) };
    } catch (e) {
      console.error(`Resposta inválida em ${nomeRota}:`, text);
      throw new Error(`A rota ${nomeRota} não retornou JSON. Verifique o backend.`);
    }
  }

  async function carregarBases() {
    try {
      const [fachadasResp, tipologiasResp] = await Promise.all([
        fetchJsonSeguro(`${API}/fachadas`, "/fachadas"),
        fetchJsonSeguro(`${API}/tipologias`, "/tipologias")
      ]);

      if (!fachadasResp.ok) {
        alert(fachadasResp.data?.erro || "Erro ao carregar fachadas");
        return;
      }

      if (!tipologiasResp.ok) {
        alert(tipologiasResp.data?.erro || "Erro ao carregar tipologias");
        return;
      }

      setFachadas(Array.isArray(fachadasResp.data) ? fachadasResp.data : []);
      setTipologias(Array.isArray(tipologiasResp.data) ? tipologiasResp.data : []);
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao carregar dados");
    }
  }

  async function carregarFachada(id) {
    if (!id) return;

    try {
      const resp = await fetchJsonSeguro(`${API}/fachadas/${id}`, `/fachadas/${id}`);

      if (!resp.ok) {
        alert(resp.data?.erro || "Erro ao carregar fachada");
        return;
      }

      setFachada(resp.data);
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao carregar fachada");
    }
  }

  async function gerarPDF() {
    if (!pranchaRef.current) {
      alert("Prancha não encontrada");
      return;
    }

    const canvas = await html2canvas(pranchaRef.current, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a3");

    const pdfWidth = 420;
    const margem = 10;
    const imgWidth = pdfWidth - margem * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margem, 10, imgWidth, imgHeight);
    pdf.save(`prancha-fachada-${fachada?.id || "sem-id"}.pdf`);
  }

  const larguraTotal = Number(fachada?.largura_total_mm || 0);
  const alturaTotal = Number(fachada?.altura_total_mm || 0);
  const modulos = coletarFolhas(fachada?.desenho_json?.modulos || []);

  const escala =
    larguraTotal > 0
      ? Math.min(900 / larguraTotal, 500 / Math.max(alturaTotal, 1))
      : 0.12;

  const desenhoWidth = larguraTotal * escala;
  const desenhoHeight = alturaTotal * escala;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Elevação Técnica Cotada + Prancha Executiva</h1>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20
        }}
      >
        <select
          value={fachadaId}
          onChange={(e) => {
            setFachadaId(e.target.value);
            carregarFachada(e.target.value);
          }}
          style={{
            padding: 10,
            marginRight: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 260
          }}
        >
          <option value="">Selecione a fachada</option>
          {fachadas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>

        <button
          onClick={gerarPDF}
          style={{
            padding: "10px 14px",
            border: "none",
            borderRadius: 6,
            background: "#0f172a",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Gerar Prancha Executiva PDF
        </button>
      </div>

      {fachada && (
        <div
          ref={pranchaRef}
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: 20,
            width: 1400,
            minHeight: 900
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              borderBottom: "2px solid #000",
              paddingBottom: 12,
              marginBottom: 20
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>PRANCHA EXECUTIVA - FACHADA</h2>
              <div style={{ marginTop: 6 }}>Projeto: {fachada.nome}</div>
              <div>Fachada ID: {fachada.id}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div><strong>Largura total:</strong> {larguraTotal} mm</div>
              <div><strong>Altura total:</strong> {alturaTotal} mm</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div style={{ border: "1px solid #bbb", padding: 16, minHeight: 700 }}>
              <h3 style={{ marginTop: 0 }}>Elevação Técnica</h3>

              <div
                style={{
                  position: "relative",
                  width: desenhoWidth + 60,
                  height: desenhoHeight + 60
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    top: 30,
                    width: desenhoWidth,
                    height: desenhoHeight,
                    border: "2px solid #000",
                    background: "#fff"
                  }}
                >
                  {modulos.map((m, index) => (
                    <div
                      key={m.id}
                      style={{
                        position: "absolute",
                        left: m.x * escala,
                        top: m.y * escala,
                        width: m.w * escala,
                        height: m.h * escala,
                        border: "1px solid #111",
                        background: "#f8fafc",
                        boxSizing: "border-box",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginTop: 8
                        }}
                      >
                        M{index + 1}
                      </div>

                      <div
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          marginTop: 6,
                          padding: "0 4px"
                        }}
                      >
                        {nomeTipologia(tipologias, m.tipologia_id)}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          fontSize: 9
                        }}
                      >
                        {Math.round(m.w)} x {Math.round(m.h)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #bbb", padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Quadro de Módulos</h3>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #999", padding: 6, background: "#e5e7eb" }}>Módulo</th>
                    <th style={{ border: "1px solid #999", padding: 6, background: "#e5e7eb" }}>Tipologia</th>
                    <th style={{ border: "1px solid #999", padding: 6, background: "#e5e7eb" }}>L x H</th>
                  </tr>
                </thead>
                <tbody>
                  {modulos.map((m, i) => (
                    <tr key={m.id}>
                      <td style={{ border: "1px solid #999", padding: 6 }}>M{i + 1}</td>
                      <td style={{ border: "1px solid #999", padding: 6 }}>
                        {nomeTipologia(tipologias, m.tipologia_id)}
                      </td>
                      <td style={{ border: "1px solid #999", padding: 6 }}>
                        {Math.round(m.w)} x {Math.round(m.h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ marginTop: 20 }}>Resumo Técnico</h3>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div><strong>Projeto:</strong> {fachada.nome}</div>
                <div><strong>Fachada ID:</strong> {fachada.id}</div>
                <div><strong>Largura total:</strong> {larguraTotal} mm</div>
                <div><strong>Altura total:</strong> {alturaTotal} mm</div>
                <div><strong>Total de módulos:</strong> {modulos.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}