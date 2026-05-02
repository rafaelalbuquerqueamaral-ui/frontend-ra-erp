import { useEffect, useMemo, useState } from "react";
import { calcularFormula } from "../utils/calculoPerfil";

function moeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Aba({ ativa, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        border: "1px solid #cfd8e3",
        borderBottom: ativa ? "2px solid #1d4ed8" : "1px solid #cfd8e3",
        background: ativa ? "#1f2937" : "#fff",
        color: ativa ? "#fff" : "#111827",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function MiniDesenhoTipologia() {
  return (
    <div
      style={{
        width: 90,
        height: 90,
        border: "1px solid #cbd5e1",
        borderRadius: 6,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="70" height="70" viewBox="0 0 70 70">
        <rect x="8" y="8" width="54" height="54" fill="#fff" stroke="#111827" strokeWidth="1.5" />
        <rect x="11" y="11" width="23" height="48" fill="#f8fafc" stroke="#64748b" />
        <rect x="36" y="11" width="23" height="48" fill="#f8fafc" stroke="#64748b" />
        <line x1="24" y1="35" x2="17" y2="35" stroke="#111827" />
        <polygon points="16,35 20,33 20,37" fill="#111827" />
        <line x1="46" y1="35" x2="53" y2="35" stroke="#111827" />
        <polygon points="54,35 50,33 50,37" fill="#111827" />
      </svg>
    </div>
  );
}

const td = {
  borderBottom: "1px solid #e5e7eb",
  padding: "8px 10px",
  fontSize: 12,
  verticalAlign: "middle",
};

const th = {
  borderBottom: "1px solid #cbd5e1",
  padding: "8px 10px",
  fontSize: 12,
  textAlign: "left",
  background: "#f8fafc",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const btnAcao = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#111827",
  borderRadius: 6,
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 11,
};

export default function TipologiaTecnicaPremium() {
  const [aba, setAba] = useState("modulos");

  const [tipologias, setTipologias] = useState([]);
  const [tipologiaId, setTipologiaId] = useState("");
  const [tipologia, setTipologia] = useState(null);

  const largura = Number(tipologia?.larguraPadrao || 1200);
  const altura = Number(tipologia?.alturaPadrao || 1000);

  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [modulos, setModulos] = useState([]);

  const [perfilCodigo, setPerfilCodigo] = useState("");
  const [perfilFormula, setPerfilFormula] = useState("");
  const [perfilQuantidade, setPerfilQuantidade] = useState("1");
  const [perfilCorte, setPerfilCorte] = useState("90/90");
  const [perfilDescricao, setPerfilDescricao] = useState("");
  const [perfilCondicao, setPerfilCondicao] = useState("");
  const [perfilValor, setPerfilValor] = useState("");

  const [vidroCodigo, setVidroCodigo] = useState("");
  const [vidroFormula, setVidroFormula] = useState("((L-40)*(H-40))/1000000");
  const [vidroQuantidade, setVidroQuantidade] = useState("1");
  const [vidroDescricao, setVidroDescricao] = useState("");
  const [vidroTipo, setVidroTipo] = useState("");
  const [vidroEspessura, setVidroEspessura] = useState("");
  const [vidroValor, setVidroValor] = useState("");

  const [acessorioCodigo, setAcessorioCodigo] = useState("");
  const [acessorioFormula, setAcessorioFormula] = useState("2");
  const [acessorioQuantidade, setAcessorioQuantidade] = useState("1");
  const [acessorioDescricao, setAcessorioDescricao] = useState("");
  const [acessorioObservacao, setAcessorioObservacao] = useState("");
  const [acessorioValor, setAcessorioValor] = useState("");

  const [moduloNome, setModuloNome] = useState("");
  const [moduloTipo, setModuloTipo] = useState("fixo");
  const [moduloLargura, setModuloLargura] = useState("");
  const [moduloAltura, setModuloAltura] = useState("");
  const [moduloObservacao, setModuloObservacao] = useState("");
  const [moduloPosX, setModuloPosX] = useState("0");
  const [moduloPosY, setModuloPosY] = useState("0");

  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [tipologiaFilhaId, setTipologiaFilhaId] = useState("");

  useEffect(() => {
    carregarTipologias();
  }, []);

  useEffect(() => {
    if (tipologiaId) {
      carregarTipologia();
      carregarPerfis();
      carregarVidros();
      carregarAcessorios();
      carregarModulos();
    }
  }, [tipologiaId]);

  async function carregarTipologias() {
    try {
      const res = await fetch("http://localhost:3001/tipologias");
      const data = await res.json();
      setTipologias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar tipologias");
    }
  }

  async function carregarTipologia() {
    try {
      const res = await fetch(`http://localhost:3001/tipologias/${tipologiaId}`);
      const data = await res.json();
      setTipologia(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar tipologia");
    }
  }

  async function carregarPerfis() {
    const res = await fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis`);
    const data = await res.json();
    setPerfis(Array.isArray(data) ? data : []);
  }

  async function carregarVidros() {
    const res = await fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros`);
    const data = await res.json();
    setVidros(Array.isArray(data) ? data : []);
  }

  async function carregarAcessorios() {
    const res = await fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios`);
    const data = await res.json();
    setAcessorios(Array.isArray(data) ? data : []);
  }

  async function carregarModulos() {
    const res = await fetch(`http://localhost:3001/tipologias/${tipologiaId}/modulos`);
    const data = await res.json();
    setModulos(Array.isArray(data) ? data : []);
  }

  async function salvarPerfil() {
    if (!tipologiaId) return alert("Selecione a tipologia");

    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: perfilCodigo,
        formula: perfilFormula,
        quantidade: perfilQuantidade,
        descricao: perfilDescricao,
        corte: perfilCorte,
        condicao: perfilCondicao,
        valorUnitario: perfilValor,
        unidade: "m",
      }),
    });

    setPerfilCodigo("");
    setPerfilFormula("");
    setPerfilQuantidade("1");
    setPerfilCorte("90/90");
    setPerfilDescricao("");
    setPerfilCondicao("");
    setPerfilValor("");
    carregarPerfis();
  }

  async function salvarVidro() {
    if (!tipologiaId) return alert("Selecione a tipologia");

    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: vidroCodigo,
        formula: vidroFormula,
        quantidade: vidroQuantidade,
        descricao: vidroDescricao,
        tipo: vidroTipo,
        espessura: vidroEspessura,
        valorUnitario: vidroValor,
        unidade: "m2",
      }),
    });

    setVidroCodigo("");
    setVidroFormula("((L-40)*(H-40))/1000000");
    setVidroQuantidade("1");
    setVidroDescricao("");
    setVidroTipo("");
    setVidroEspessura("");
    setVidroValor("");
    carregarVidros();
  }

  async function salvarAcessorio() {
    if (!tipologiaId) return alert("Selecione a tipologia");

    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: acessorioCodigo,
        formula: acessorioFormula,
        quantidade: acessorioQuantidade,
        descricao: acessorioDescricao,
        observacao: acessorioObservacao,
        valorUnitario: acessorioValor,
        unidade: "un",
      }),
    });

    setAcessorioCodigo("");
    setAcessorioFormula("2");
    setAcessorioQuantidade("1");
    setAcessorioDescricao("");
    setAcessorioObservacao("");
    setAcessorioValor("");
    carregarAcessorios();
  }

  async function salvarModulo() {
    if (!tipologiaId) return alert("Selecione a tipologia");

    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/modulos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: moduloNome,
        tipo: moduloTipo,
        largura: moduloLargura,
        altura: moduloAltura,
        observacao: moduloObservacao,
        posX: moduloPosX,
        posY: moduloPosY,
      }),
    });

    setModuloNome("");
    setModuloTipo("fixo");
    setModuloLargura("");
    setModuloAltura("");
    setModuloObservacao("");
    setModuloPosX("0");
    setModuloPosY("0");
    carregarModulos();
  }

  async function vincularTipologiaNoModulo() {
    if (!moduloSelecionado) {
      alert("Selecione um módulo");
      return;
    }

    if (!tipologiaFilhaId) {
      alert("Selecione a tipologia filha");
      return;
    }

    const tipologiaFilha = tipologias.find(
      (t) => String(t.id) === String(tipologiaFilhaId)
    );

    await fetch(
      `http://localhost:3001/tipologias/${tipologiaId}/modulos/${moduloSelecionado.id}/tipologia`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipologiaFilhaId,
          tipologiaFilhaNome: tipologiaFilha?.nome || "",
        }),
      }
    );

    setTipologiaFilhaId("");
    setModuloSelecionado(null);
    carregarModulos();
  }

  async function excluirPerfil(itemId) {
    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/perfis/${itemId}`, {
      method: "DELETE",
    });
    carregarPerfis();
  }

  async function excluirVidro(itemId) {
    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/vidros/${itemId}`, {
      method: "DELETE",
    });
    carregarVidros();
  }

  async function excluirAcessorio(itemId) {
    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/acessorios/${itemId}`, {
      method: "DELETE",
    });
    carregarAcessorios();
  }

  async function excluirModulo(itemId) {
    await fetch(`http://localhost:3001/tipologias/${tipologiaId}/modulos/${itemId}`, {
      method: "DELETE",
    });
    carregarModulos();
  }

  const totalPerfis = useMemo(() => {
    return perfis.reduce((acc, item) => {
      const medida = calcularFormula(item.formula, largura, altura);
      return acc + medida * Number(item.quantidade || 0) * Number(item.valorUnitario || 0);
    }, 0);
  }, [perfis, largura, altura]);

  const totalVidros = useMemo(() => {
    return vidros.reduce((acc, item) => {
      const medida = calcularFormula(item.formula, largura, altura);
      return acc + medida * Number(item.quantidade || 0) * Number(item.valorUnitario || 0);
    }, 0);
  }, [vidros, largura, altura]);

  const totalAcessorios = useMemo(() => {
    return acessorios.reduce((acc, item) => {
      const resultado = calcularFormula(item.formula, largura, altura);
      return acc + resultado * Number(item.quantidade || 0) * Number(item.valorUnitario || 0);
    }, 0);
  }, [acessorios, largura, altura]);

  const totalGeral = totalPerfis + totalVidros + totalAcessorios;

  const nomeTipologia = tipologia?.nome || "Selecione a tipologia";
  const linhaTipologia = tipologia?.linha || "-";

  return (
    <div style={{ padding: 16, background: "#f3f4f6", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #d1d5db",
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>
          ENGENHARIA DO PRODUTO
        </div>

        <div style={{ marginBottom: 12 }}>
          <select
            value={tipologiaId}
            onChange={(e) => setTipologiaId(e.target.value)}
            style={{ padding: 10, minWidth: 350 }}
          >
            <option value="">Selecione a tipologia</option>
            {tipologias.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} - {t.linha}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>{nomeTipologia}</div>
            <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>{linhaTipologia}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
              Largura: {largura} | Altura: {altura}
            </div>
          </div>

          <MiniDesenhoTipologia />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <Aba ativa={aba === "perfis"} onClick={() => setAba("perfis")}>Perfis</Aba>
          <Aba ativa={aba === "acessorios"} onClick={() => setAba("acessorios")}>Acessórios</Aba>
          <Aba ativa={aba === "vidros"} onClick={() => setAba("vidros")}>Vidros / Chapas</Aba>
          <Aba ativa={aba === "modulos"} onClick={() => setAba("modulos")}>Módulos</Aba>
          <Aba ativa={aba === "desenho"} onClick={() => setAba("desenho")}>Desenho Técnico</Aba>
          <Aba ativa={aba === "variaveis"} onClick={() => setAba("variaveis")}>Variáveis</Aba>
          <Aba ativa={aba === "comprar"} onClick={() => setAba("comprar")}>Comprar</Aba>
          <Aba ativa={aba === "testar"} onClick={() => setAba("testar")}>Testar</Aba>
        </div>

        {aba === "perfis" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 90px 1fr 1fr 120px auto", gap: 8, marginBottom: 10 }}>
              <input placeholder="Código" value={perfilCodigo} onChange={(e) => setPerfilCodigo(e.target.value)} />
              <input placeholder="Medida / Fórmula (ex: L-28)" value={perfilFormula} onChange={(e) => setPerfilFormula(e.target.value)} />
              <input placeholder="Qtde" value={perfilQuantidade} onChange={(e) => setPerfilQuantidade(e.target.value)} />
              <input placeholder="Corte" value={perfilCorte} onChange={(e) => setPerfilCorte(e.target.value)} />
              <input placeholder="Descrição" value={perfilDescricao} onChange={(e) => setPerfilDescricao(e.target.value)} />
              <input placeholder="Condição" value={perfilCondicao} onChange={(e) => setPerfilCondicao(e.target.value)} />
              <input placeholder="Valor Unit." value={perfilValor} onChange={(e) => setPerfilValor(e.target.value)} />
              <button onClick={salvarPerfil}>Adicionar Perfil</button>
            </div>

            <TabelaPerfis itens={perfis} largura={largura} altura={altura} onExcluir={excluirPerfil} />
          </>
        )}

        {aba === "vidros" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 80px 1fr 1fr 100px 120px auto", gap: 8, marginBottom: 10 }}>
              <input placeholder="Código" value={vidroCodigo} onChange={(e) => setVidroCodigo(e.target.value)} />
              <input placeholder="Fórmula área (ex: ((L-40)*(H-40))/1000000)" value={vidroFormula} onChange={(e) => setVidroFormula(e.target.value)} />
              <input placeholder="Qtd" value={vidroQuantidade} onChange={(e) => setVidroQuantidade(e.target.value)} />
              <input placeholder="Descrição" value={vidroDescricao} onChange={(e) => setVidroDescricao(e.target.value)} />
              <input placeholder="Tipo vidro" value={vidroTipo} onChange={(e) => setVidroTipo(e.target.value)} />
              <input placeholder="Espessura" value={vidroEspessura} onChange={(e) => setVidroEspessura(e.target.value)} />
              <input placeholder="Valor Unit." value={vidroValor} onChange={(e) => setVidroValor(e.target.value)} />
              <button onClick={salvarVidro}>Adicionar Vidro</button>
            </div>

            <TabelaVidros itens={vidros} largura={largura} altura={altura} onExcluir={excluirVidro} />
          </>
        )}

        {aba === "acessorios" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr 1fr 120px auto", gap: 8, marginBottom: 10 }}>
              <input placeholder="Código" value={acessorioCodigo} onChange={(e) => setAcessorioCodigo(e.target.value)} />
              <input placeholder="Fórmula (ex: 2, H/500, (L/800)+1)" value={acessorioFormula} onChange={(e) => setAcessorioFormula(e.target.value)} />
              <input placeholder="Qtd" value={acessorioQuantidade} onChange={(e) => setAcessorioQuantidade(e.target.value)} />
              <input placeholder="Descrição" value={acessorioDescricao} onChange={(e) => setAcessorioDescricao(e.target.value)} />
              <input placeholder="Observação" value={acessorioObservacao} onChange={(e) => setAcessorioObservacao(e.target.value)} />
              <input placeholder="Valor Unit." value={acessorioValor} onChange={(e) => setAcessorioValor(e.target.value)} />
              <button onClick={salvarAcessorio}>Adicionar Acessório</button>
            </div>

            <TabelaAcessorios itens={acessorios} largura={largura} altura={altura} onExcluir={excluirAcessorio} />
          </>
        )}

        {aba === "modulos" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 1fr 80px 80px auto", gap: 8, marginBottom: 10 }}>
              <input placeholder="Nome do módulo" value={moduloNome} onChange={(e) => setModuloNome(e.target.value)} />
              <select value={moduloTipo} onChange={(e) => setModuloTipo(e.target.value)}>
                <option value="fixo">Fixo</option>
                <option value="janela">Janela</option>
                <option value="porta">Porta</option>
                <option value="maxim-ar">Maxim-ar</option>
                <option value="basculante">Basculante</option>
                <option value="painel">Painel</option>
              </select>
              <input placeholder="Largura" value={moduloLargura} onChange={(e) => setModuloLargura(e.target.value)} />
              <input placeholder="Altura" value={moduloAltura} onChange={(e) => setModuloAltura(e.target.value)} />
              <input placeholder="Observação" value={moduloObservacao} onChange={(e) => setModuloObservacao(e.target.value)} />
              <input placeholder="X" value={moduloPosX} onChange={(e) => setModuloPosX(e.target.value)} />
              <input placeholder="Y" value={moduloPosY} onChange={(e) => setModuloPosY(e.target.value)} />
              <button onClick={salvarModulo}>Adicionar Módulo</button>
            </div>

            {moduloSelecionado && (
              <div
                style={{
                  marginBottom: 12,
                  padding: 12,
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  background: "#eff6ff",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <strong>Módulo selecionado:</strong> {moduloSelecionado.nome}
                <select
                  value={tipologiaFilhaId}
                  onChange={(e) => setTipologiaFilhaId(e.target.value)}
                  style={{ padding: 8, minWidth: 240 }}
                >
                  <option value="">Escolha a tipologia interna</option>
                  {tipologias
                    .filter((t) => String(t.id) !== String(tipologiaId))
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} - {t.linha}
                      </option>
                    ))}
                </select>

                <button onClick={vincularTipologiaNoModulo}>
                  Inserir Tipologia no Módulo
                </button>
              </div>
            )}

            <TabelaModulos
              itens={modulos}
              onExcluir={excluirModulo}
              onSelecionar={setModuloSelecionado}
            />

            <DesenhoModulos
              larguraBase={largura}
              alturaBase={altura}
              modulos={modulos}
              moduloSelecionado={moduloSelecionado}
              onSelecionarModulo={setModuloSelecionado}
            />
          </>
        )}

        {aba !== "perfis" && aba !== "vidros" && aba !== "acessorios" && aba !== "modulos" && (
          <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Módulo em construção</div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              Esta aba será a próxima etapa da engenharia da tipologia.
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#374151" }}>
            <strong>Total Perfis:</strong> {moeda(totalPerfis)}{" "}
            | <strong>Total Vidros:</strong> {moeda(totalVidros)}{" "}
            | <strong>Total Acessórios:</strong> {moeda(totalAcessorios)}{" "}
            | <strong>Total Geral:</strong> {moeda(totalGeral)}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#0891b2",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Salvar
            </button>

            <button
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#6b7280",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabelaPerfis({ itens, largura, altura, onExcluir }) {
  return (
    <TabelaBase
      colunas={[
        { label: "Perfil", render: (item) => item.codigo },
        { label: "Medida / Fórmula", render: (item) => item.formula },
        { label: "Qtde", render: (item) => item.quantidade },
        { label: "Medida", render: (item) => calcularFormula(item.formula, largura, altura) },
        { label: "Corte", render: (item) => item.corte },
        { label: "Descrição", render: (item) => item.descricao },
        { label: "Condição", render: (item) => item.condicao },
        { label: "Valor", render: (item) => moeda(item.valorUnitario) },
        {
          label: "Ações",
          render: (item) => (
            <button onClick={() => onExcluir(item.id)} style={btnAcao}>
              Excluir
            </button>
          ),
        },
      ]}
      itens={itens}
    />
  );
}

function TabelaVidros({ itens, largura, altura, onExcluir }) {
  return (
    <TabelaBase
      colunas={[
        { label: "Código", render: (item) => item.codigo },
        { label: "Fórmula", render: (item) => item.formula },
        { label: "Qtd", render: (item) => item.quantidade },
        { label: "Área / Medida", render: (item) => calcularFormula(item.formula, largura, altura) },
        { label: "Descrição", render: (item) => item.descricao },
        { label: "Tipo", render: (item) => item.tipo },
        { label: "Espessura", render: (item) => item.espessura },
        { label: "Valor", render: (item) => moeda(item.valorUnitario) },
        {
          label: "Ações",
          render: (item) => (
            <button onClick={() => onExcluir(item.id)} style={btnAcao}>
              Excluir
            </button>
          ),
        },
      ]}
      itens={itens}
    />
  );
}

function TabelaAcessorios({ itens, largura, altura, onExcluir }) {
  return (
    <TabelaBase
      colunas={[
        { label: "Código", render: (item) => item.codigo },
        { label: "Fórmula", render: (item) => item.formula },
        { label: "Qtd", render: (item) => item.quantidade },
        { label: "Resultado", render: (item) => calcularFormula(item.formula, largura, altura) },
        { label: "Descrição", render: (item) => item.descricao },
        { label: "Observação", render: (item) => item.observacao },
        { label: "Valor", render: (item) => moeda(item.valorUnitario) },
        {
          label: "Ações",
          render: (item) => (
            <button onClick={() => onExcluir(item.id)} style={btnAcao}>
              Excluir
            </button>
          ),
        },
      ]}
      itens={itens}
    />
  );
}

function TabelaModulos({ itens, onExcluir, onSelecionar }) {
  return (
    <TabelaBase
      colunas={[
        { label: "Nome", render: (item) => item.nome },
        { label: "Tipo", render: (item) => item.tipo },
        { label: "Largura", render: (item) => item.largura },
        { label: "Altura", render: (item) => item.altura },
        { label: "Obs", render: (item) => item.observacao },
        { label: "X", render: (item) => item.posX },
        { label: "Y", render: (item) => item.posY },
        { label: "Tipologia Interna", render: (item) => item.tipologiaFilhaNome || "-" },
        {
          label: "Ações",
          render: (item) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onSelecionar(item)} style={btnAcao}>
                Selecionar
              </button>
              <button onClick={() => onExcluir(item.id)} style={btnAcao}>
                Excluir
              </button>
            </div>
          ),
        },
      ]}
      itens={itens}
    />
  );
}

function TabelaBase({ colunas, itens }) {
  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        overflow: "auto",
        maxHeight: 430,
        background: "#fff",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {colunas.map((col, i) => (
              <th key={i} style={th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itens.length === 0 ? (
            <tr>
              <td colSpan={colunas.length} style={{ padding: 18, textAlign: "center", color: "#6b7280" }}>
                Nenhum item adicionado nesta aba
              </td>
            </tr>
          ) : (
            itens.map((item, index) => (
              <tr key={item.id || index} style={{ background: index === 0 ? "#fef9c3" : "#fff" }}>
                {colunas.map((col, i) => (
                  <td key={i} style={td}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function DesenhoModulos({
  larguraBase,
  alturaBase,
  modulos,
  moduloSelecionado,
  onSelecionarModulo,
}) {
  const w = 420;
  const h = 260;

  const escalaX = larguraBase > 0 ? w / larguraBase : 1;
  const escalaY = alturaBase > 0 ? h / alturaBase : 1;

  return (
    <div
      style={{
        marginTop: 16,
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#fff",
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        Preview dos Módulos (clique no módulo)
      </div>

      <svg width={w + 20} height={h + 20} style={{ background: "#f8fafc", border: "1px solid #e5e7eb" }}>
        <rect x="10" y="10" width={w} height={h} fill="#fff" stroke="#111827" strokeWidth="2" />

        {modulos.map((m) => {
          const x = 10 + Number(m.posX || 0) * escalaX;
          const y = 10 + Number(m.posY || 0) * escalaY;
          const mw = Number(m.largura || 0) * escalaX;
          const mh = Number(m.altura || 0) * escalaY;
          const selecionado = moduloSelecionado?.id === m.id;

          return (
            <g
              key={m.id}
              onClick={() => onSelecionarModulo(m)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={mw}
                height={mh}
                fill={selecionado ? "rgba(234,179,8,0.18)" : "rgba(59,130,246,0.12)"}
                stroke={selecionado ? "#ca8a04" : "#2563eb"}
                strokeWidth="1.5"
              />
              <text x={x + 4} y={y + 14} fontSize="10" fill="#111827">
                {m.nome}
              </text>
              <text x={x + 4} y={y + 26} fontSize="9" fill="#374151">
                {m.tipo}
              </text>
              <text x={x + 4} y={y + 38} fontSize="8" fill="#0f172a">
                {m.tipologiaFilhaNome || "sem tipologia"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}