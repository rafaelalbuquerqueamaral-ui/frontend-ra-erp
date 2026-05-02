import React, { useEffect, useState } from "react";
import "./OrcamentoPro.css";

const API = "http://localhost:3001";

export default function OrcamentoPro() {
  const [tipologias, setTipologias] = useState([]);
  const [tipSelecionada, setTipSelecionada] = useState(null);
  const [resultado, setResultado] = useState(null);

  const [form, setForm] = useState({
    tipologia_id: "",
    largura: "",
    altura: "",
  });

  useEffect(() => {
    carregarTipologias();
  }, []);

  async function carregarTipologias() {
    try {
      const res = await fetch(`${API}/tipologias`);
      const data = await res.json();
      setTipologias(Array.isArray(data) ? data : []);
    } catch {
      setTipologias([]);
    }
  }

  function selecionarTipologia(id) {
    const tip = tipologias.find((t) => Number(t.id) === Number(id));

    setTipSelecionada(tip || null);

    setForm({
      tipologia_id: id,
      largura: tip?.largura_padrao || "",
      altura: tip?.altura_padrao || "",
    });

    setResultado(null);
  }

  async function calcular(e) {
    e.preventDefault();

    if (!form.tipologia_id || !form.largura || !form.altura) {
      alert("Selecione a tipologia e informe as medidas.");
      return;
    }

    const res = await fetch(`${API}/orcamento-pro/calcular`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipologia_id: Number(form.tipologia_id),
        largura: Number(form.largura),
        altura: Number(form.altura),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao calcular orçamento.");
      return;
    }

    setResultado(data);
  }

  async function salvarOrcamento() {
    if (!resultado) {
      alert("Calcule antes de salvar.");
      return;
    }

    const body = {
      cliente: "Cliente não informado",
      tipologia: resultado.tipologia,
      largura: resultado.largura,
      altura: resultado.altura,
      valor_total: resultado.vendaTotal,
    };

    const res = await fetch(`${API}/orcamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Erro ao salvar orçamento.");
      return;
    }

    alert("Orçamento salvo com sucesso!");
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function gerarListaCorte() {
    if (!resultado?.listaPerfis) return [];

    const tamanhoBarra = 6000;
    const perdaSerra = 3;
    let pecas = [];

    resultado.listaPerfis.forEach((p) => {
      const medidaMm = Math.round(Number(p.medida_metro || 0) * 1000);

      for (let i = 0; i < Number(p.quantidade || 1); i++) {
        pecas.push({
          perfil: p.nome,
          medida: medidaMm,
        });
      }
    });

    pecas.sort((a, b) => b.medida - a.medida);

    const barras = [];

    pecas.forEach((peca) => {
      let encaixou = false;

      for (let barra of barras) {
        const usado = barra.pecas.reduce(
          (s, p) => s + p.medida + perdaSerra,
          0
        );

        if (usado + peca.medida + perdaSerra <= tamanhoBarra) {
          barra.pecas.push(peca);
          encaixou = true;
          break;
        }
      }

      if (!encaixou) {
        barras.push({ pecas: [peca] });
      }
    });

    return barras.map((barra, index) => {
      const usado = barra.pecas.reduce(
        (s, p) => s + p.medida + perdaSerra,
        0
      );

      return {
        barra: index + 1,
        pecas: barra.pecas,
        usado,
        sobra: tamanhoBarra - usado,
        aproveitamento: (usado / tamanhoBarra) * 100,
      };
    });
  }

  const listaCorte = gerarListaCorte();

  return (
    <div className="orc-page">
      <div className="tela-normal">
        <div className="orc-header">
          <h1>Orçamento Técnico Premium</h1>
          <p>Orçamento com imagem da tipologia, memória técnica, materiais e PDF.</p>
        </div>

        <form className="orc-card" onSubmit={calcular}>
          <h2>Novo Orçamento</h2>

          <div className="orc-grid">
            <select
              value={form.tipologia_id}
              onChange={(e) => selecionarTipologia(e.target.value)}
            >
              <option value="">Selecione a tipologia</option>

              {tipologias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome} - {t.linha}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Largura em mm"
              value={form.largura}
              onChange={(e) => setForm({ ...form, largura: e.target.value })}
            />

            <input
              type="number"
              placeholder="Altura em mm"
              value={form.altura}
              onChange={(e) => setForm({ ...form, altura: e.target.value })}
            />
          </div>

          {tipSelecionada && (
            <div className="tip-preview">
              {tipSelecionada.imagem ? (
                <img
                  src={`${API}/uploads/${tipSelecionada.imagem}`}
                  alt={tipSelecionada.nome}
                />
              ) : (
                <div className="sem-img">Sem imagem</div>
              )}

              <div>
                <h3>{tipSelecionada.nome}</h3>
                <p><b>Linha:</b> {tipSelecionada.linha}</p>
                <p><b>Padrão:</b> {tipSelecionada.largura_padrao} x {tipSelecionada.altura_padrao} mm</p>
                <p>{tipSelecionada.observacao_tecnica}</p>
              </div>
            </div>
          )}

          <button className="btn-calcular" type="submit">
            Calcular Orçamento
          </button>
        </form>

        {resultado && (
          <>
            <div className="orc-resumo">
              <div className="resumo-card">
                <span>Área</span>
                <strong>{Number(resultado.area).toFixed(2)} m²</strong>
              </div>

              <div className="resumo-card">
                <span>Alumínio</span>
                <strong>{dinheiro(resultado.totalAluminio)}</strong>
              </div>

              <div className="resumo-card">
                <span>Pintura</span>
                <strong>{dinheiro(resultado.totalPintura)}</strong>
              </div>

              <div className="resumo-card">
                <span>Vidro</span>
                <strong>{dinheiro(resultado.totalVidro)}</strong>
              </div>

              <div className="resumo-card destaque">
                <span>Venda Final</span>
                <strong>{dinheiro(resultado.vendaTotal)}</strong>
              </div>
            </div>

            <div className="orc-card">
              <h2>Memória Técnica</h2>
              <p><b>Tipologia:</b> {resultado.tipologia}</p>
              <p><b>Linha:</b> {resultado.linha}</p>
              <p><b>Medidas:</b> {resultado.largura} x {resultado.altura} mm</p>
              <p><b>Peso alumínio:</b> {Number(resultado.totalPesoAluminio).toFixed(3)} kg</p>
            </div>

            <div className="orc-card">
              <h2>Perfis Calculados</h2>

              <table>
                <thead>
                  <tr>
                    <th>Perfil</th>
                    <th>Qtd</th>
                    <th>Fórmula</th>
                    <th>Medida</th>
                    <th>Peso</th>
                    <th>Custo</th>
                  </tr>
                </thead>

                <tbody>
                  {resultado.listaPerfis?.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nome}</td>
                      <td>{p.quantidade}</td>
                      <td>{p.formula}</td>
                      <td>{Number(p.medida_metro).toFixed(2)} m</td>
                      <td>{Number(p.peso_total).toFixed(3)} kg</td>
                      <td>{dinheiro(p.custo_aluminio + p.custo_pintura)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="orc-card">
              <h2>Lista de Corte Industrial</h2>

              {listaCorte.map((barra) => (
                <div key={barra.barra} className="barra-box">
                  <h3>Barra {barra.barra} - 6000 mm</h3>

                  <table>
                    <tbody>
                      {barra.pecas.map((p, i) => (
                        <tr key={i}>
                          <td>{p.perfil}</td>
                          <td>{p.medida} mm</td>
                        </tr>
                      ))}

                      <tr>
                        <td><b>Usado</b></td>
                        <td><b>{barra.usado} mm</b></td>
                      </tr>

                      <tr>
                        <td><b>Sobra</b></td>
                        <td><b>{barra.sobra} mm</b></td>
                      </tr>

                      <tr>
                        <td><b>Aproveitamento</b></td>
                        <td><b>{barra.aproveitamento.toFixed(2)}%</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <button className="btn-calcular" onClick={salvarOrcamento}>
              Salvar Orçamento
            </button>

            <button className="btn-pdf" onClick={() => window.print()}>
              Gerar PDF Técnico Premium
            </button>
          </>
        )}
      </div>

      {resultado && (
        <div className="pdf-area">
          <div className="pdf-header">
            <div>
              <h1>R&A VIDROS</h1>
              <p>Orçamento Técnico Premium</p>
            </div>

            <div>
              <h2>ORÇAMENTO</h2>
              <p>{new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div className="pdf-topo">
            {tipSelecionada?.imagem ? (
              <img
                src={`${API}/uploads/${tipSelecionada.imagem}`}
                alt={tipSelecionada.nome}
              />
            ) : (
              <div className="pdf-sem-img">Sem imagem</div>
            )}

            <div>
              <h2>{resultado.tipologia}</h2>
              <p><b>Linha:</b> {resultado.linha}</p>
              <p><b>Medidas:</b> {resultado.largura} x {resultado.altura} mm</p>
              <p><b>Área:</b> {Number(resultado.area).toFixed(2)} m²</p>
              <p><b>Observação:</b> {tipSelecionada?.observacao_tecnica || ""}</p>
            </div>
          </div>

          <div className="pdf-box">
            <h3>Memória Técnica</h3>
            <p><b>Peso total alumínio:</b> {Number(resultado.totalPesoAluminio).toFixed(3)} kg</p>
            <p><b>Vidro:</b> {resultado.vidro?.nome || resultado.vidro?.tipo || "Não informado"}</p>
          </div>

          <div className="pdf-box">
            <h3>Perfis Calculados</h3>

            <table className="pdf-table">
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Qtd</th>
                  <th>Fórmula</th>
                  <th>Medida</th>
                  <th>Peso</th>
                  <th>Custo</th>
                </tr>
              </thead>

              <tbody>
                {resultado.listaPerfis?.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>{p.formula}</td>
                    <td>{Number(p.medida_metro).toFixed(2)} m</td>
                    <td>{Number(p.peso_total).toFixed(3)} kg</td>
                    <td>{dinheiro(p.custo_aluminio + p.custo_pintura)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pdf-box">
            <h3>Lista de Corte</h3>

            {listaCorte.map((barra) => (
              <div key={barra.barra}>
                <h4>Barra {barra.barra} - 6000 mm</h4>

                <table className="pdf-table">
                  <tbody>
                    {barra.pecas.map((p, i) => (
                      <tr key={i}>
                        <td>{p.perfil}</td>
                        <td>{p.medida} mm</td>
                      </tr>
                    ))}

                    <tr>
                      <td><b>Sobra</b></td>
                      <td><b>{barra.sobra} mm</b></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="pdf-resumo">
            <div>
              <span>Alumínio</span>
              <strong>{dinheiro(resultado.totalAluminio)}</strong>
            </div>

            <div>
              <span>Pintura</span>
              <strong>{dinheiro(resultado.totalPintura)}</strong>
            </div>

            <div>
              <span>Vidro</span>
              <strong>{dinheiro(resultado.totalVidro)}</strong>
            </div>

            <div>
              <span>Acessórios</span>
              <strong>{dinheiro(resultado.totalAcessorios)}</strong>
            </div>

            <div className="pdf-total">
              <span>VALOR FINAL</span>
              <strong>{dinheiro(resultado.vendaTotal)}</strong>
            </div>
          </div>

          <div className="pdf-footer">
            <p>R&A VIDROS E ESQUADRIAS</p>
            <p>Documento técnico gerado pelo ERP Industrial</p>
          </div>
        </div>
      )}
    </div>
  );
}