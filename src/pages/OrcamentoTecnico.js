import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrcamentoTecnico() {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [tipologias, setTipologias] = useState([]);
  const [tipologiaId, setTipologiaId] = useState("");

  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");

  const [componentes, setComponentes] = useState([]);
  const [itens, setItens] = useState([]);

  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [linhas, setLinhas] = useState([]);
  const [linhaDestinoId, setLinhaDestinoId] = useState("");

  const [trocas, setTrocas] = useState([]);

  useEffect(() => {
    carregarBases();
  }, []);

  async function carregarBases() {
    try {
      const [rTip, rPerfis, rVidros, rAcess, rLinhas] = await Promise.all([
        fetch("http://localhost:3001/tipologias"),
        fetch("http://localhost:3001/perfis"),
        fetch("http://localhost:3001/vidros"),
        fetch("http://localhost:3001/acessorios"),
        fetch("http://localhost:3001/linhas-aluminio"),
      ]);

      setTipologias(await rTip.json());
      setPerfis(await rPerfis.json());
      setVidros(await rVidros.json());
      setAcessorios(await rAcess.json());
      setLinhas(await rLinhas.json());
    } catch (e) {
      alert("Erro ao carregar bases");
    }
  }

  async function selecionarTipologia(id) {
    setTipologiaId(id);
    setItens([]);
    setTrocas([]);

    const tipologia = tipologias.find((t) => String(t.id) === String(id));

    if (tipologia) {
      setLargura(String(tipologia.larguraPadrao || ""));
      setAltura(String(tipologia.alturaPadrao || ""));
    }

    const res = await fetch(`http://localhost:3001/tipologias/${id}/componentes`);
    const data = await res.json();

    setComponentes(Array.isArray(data) ? data : []);
  }

  function calcularFormula(formula, larguraValor, alturaValor) {
    try {
      const expr = String(formula || "1")
        .replaceAll("largura", `(${Number(larguraValor)})`)
        .replaceAll("altura", `(${Number(alturaValor)})`);

      return Number(Function(`"use strict"; return (${expr})`)() || 0);
    } catch {
      return 0;
    }
  }

  function listaMateriais(categoria) {
    if (categoria === "perfil") return perfis;
    if (categoria === "vidro") return vidros;
    if (categoria === "acessorio") return acessorios;
    return [];
  }

  function gerarMateriais() {
    const l = Number(largura);
    const a = Number(altura);

    if (!tipologiaId) {
      alert("Selecione a tipologia");
      return;
    }

    if (!l || !a) {
      alert("Informe largura e altura");
      return;
    }

    const calculados = componentes.map((c) => {
      const troca = trocas.find(
        (t) => Number(t.componenteId) === Number(c.id)
      );

      const materialNome = troca?.materialNome || c.materialNome;
      const valorUnitario = Number(troca?.valorUnitario ?? c.valorUnitario ?? 0);

      const comprimentoPeca = calcularFormula(c.formula, l, a);
      const repeticoes = calcularFormula(c.formulaRepeticoes || "1", l, a);

      let quantidade = repeticoes;

      if (c.unidade === "m" || c.unidade === "m2") {
        quantidade = comprimentoPeca * repeticoes;
      }

      const subtotal = quantidade * valorUnitario;

      return {
        componenteId: c.id,
        categoria: c.categoria,
        funcao: c.funcao || "",
        materialNome,
        unidade: c.unidade,
        formula: c.formula,
        formulaRepeticoes: c.formulaRepeticoes,
        comprimentoPeca,
        repeticoes,
        quantidade,
        valorUnitario,
        subtotal,
        permiteTroca: c.permiteTroca,
      };
    });

    setItens(calculados);
  }

  function trocarMaterial(item, materialId) {
    const material = listaMateriais(item.categoria).find(
      (m) => String(m.id) === String(materialId)
    );

    if (!material) return;

    const novasTrocas = trocas.filter(
      (t) => Number(t.componenteId) !== Number(item.componenteId)
    );

    novasTrocas.push({
      componenteId: item.componenteId,
      materialId: material.id,
      materialNome: material.nome,
      valorUnitario: Number(material.valorUnitario || 0),
    });

    setTrocas(novasTrocas);

    const atualizados = itens.map((i) => {
      if (Number(i.componenteId) === Number(item.componenteId)) {
        return {
          ...i,
          materialNome: material.nome,
          valorUnitario: Number(material.valorUnitario || 0),
          subtotal: Number(i.quantidade || 0) * Number(material.valorUnitario || 0),
        };
      }

      return i;
    });

    setItens(atualizados);
  }

  async function aplicarLinha() {
    const l = Number(largura);
    const a = Number(altura);

    if (!linhaDestinoId) {
      alert("Selecione Gold, Suprema ou outra linha");
      return;
    }

    if (!tipologiaId) {
      alert("Selecione a tipologia");
      return;
    }

    const res = await fetch("http://localhost:3001/orcamentos/tecnico/trocar-linha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipologiaId,
        largura: l,
        altura: a,
        linhaDestinoId,
      }),
    });

    if (!res.ok) {
      alert("Erro ao trocar linha");
      return;
    }

    const data = await res.json();
    setItens(Array.isArray(data) ? data : []);
  }

  async function salvar() {
    if (!cliente || !tipologiaId || !largura || !altura) {
      alert("Preencha cliente, tipologia, largura e altura");
      return;
    }

    const res = await fetch("http://localhost:3001/orcamentos/tecnico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        tipologiaId,
        largura: Number(largura),
        altura: Number(altura),
        trocas,
      }),
    });

    if (!res.ok) {
      alert("Erro ao salvar orçamento");
      return;
    }

    alert("Orçamento salvo");
    navigate("/orcamentos");
  }

  const total = itens.reduce((soma, i) => soma + Number(i.subtotal || 0), 0);

  return (
    <div>
      <h1>Novo Orçamento Técnico</h1>

      <input
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <br />
      <br />

      <select value={tipologiaId} onChange={(e) => selecionarTipologia(e.target.value)}>
        <option value="">Selecione a tipologia</option>
        {tipologias.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome} - {t.linha || ""}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        placeholder="Largura"
        value={largura}
        onChange={(e) => setLargura(e.target.value)}
      />

      <input
        placeholder="Altura"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
        style={{ marginLeft: "8px" }}
      />

      <button onClick={gerarMateriais} style={{ marginLeft: "8px" }}>
        Gerar Materiais
      </button>

      <br />
      <br />

      <select
        value={linhaDestinoId}
        onChange={(e) => setLinhaDestinoId(e.target.value)}
      >
        <option value="">Trocar linha Gold / Suprema</option>
        {linhas.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nome}
          </option>
        ))}
      </select>

      <button onClick={aplicarLinha} style={{ marginLeft: "8px" }}>
        Aplicar Linha
      </button>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Material</th>
            <th>Unidade</th>
            <th>Fórmula</th>
            <th>Rep.</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Total</th>
            <th>Trocar</th>
          </tr>
        </thead>

        <tbody>
          {itens.length === 0 ? (
            <tr>
              <td colSpan="9">Nenhum item calculado</td>
            </tr>
          ) : (
            itens.map((i, index) => (
              <tr key={index}>
                <td>{i.categoria}</td>
                <td>{i.materialNome}</td>
                <td>{i.unidade}</td>
                <td>{i.formula}</td>
                <td>{i.formulaRepeticoes}</td>
                <td>{Number(i.quantidade || 0).toFixed(2)}</td>
                <td>R$ {Number(i.valorUnitario || 0).toFixed(2)}</td>
                <td>R$ {Number(i.subtotal || 0).toFixed(2)}</td>
                <td>
                  {["perfil", "vidro", "acessorio"].includes(i.categoria) ? (
                    <select onChange={(e) => trocarMaterial(i, e.target.value)}>
                      <option value="">Trocar</option>
                      {listaMateriais(i.categoria).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nome} - R$ {Number(m.valorUnitario || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Total: R$ {Number(total).toFixed(2)}</h2>

      <button onClick={salvar}>Salvar Orçamento</button>
    </div>
  );
}