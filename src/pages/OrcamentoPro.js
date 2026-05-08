import React, {
  useEffect,
  useMemo,
  useState
} from "react";
import { calcularTipologiaIndustrial } from "../services/MotorInteligenteIndustrial";
import { buscarBiblioteca } from "../services/bibliotecaService";

export default function OrcamentoPro() {
  const [cliente, setCliente] = useState("");
  const [obra, setObra] = useState("");

  const [tipologiaSelecionada, setTipologiaSelecionada] = useState("Janela de Correr 2 Folhas");
  const [linha, setLinha] = useState("Suprema");

  const [largura, setLargura] = useState(1200);
  const [altura, setAltura] = useState(1000);
  const [quantidade, setQuantidade] = useState(1);

  const [valorKg, setValorKg] = useState(45);
  const [valorM2Vidro, setValorM2Vidro] = useState(120);
  const [valorAcessorios, setValorAcessorios] = useState(50);
  const [margem, setMargem] = useState(100);

  const [perfis, setPerfis] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [acessorios, setAcessorios] = useState([]);

  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [vidroSelecionado, setVidroSelecionado] = useState("");
  const [acessorioSelecionado, setAcessorioSelecionado] = useState("");

  const [itens, setItens] = useState([]);

  const [tipologias,
  setTipologias] =
  useState([]);

 useEffect(() => {

  carregarBiblioteca();

  carregarTipologias();

}, []);
// ====================================
// CARREGAR TIPOLOGIAS
// ====================================

const carregarTipologias =
async () => {

  try {

    const response =
      await fetch(
        "http://localhost:3001/api/tipologias"
      );

    const data =
      await response.json();

    setTipologias(data);

  } catch (error) {

    console.log(error);

  }

};
  const carregarBiblioteca = async () => {
    try {
      const perfisData = await buscarBiblioteca("perfis");
      const vidrosData = await buscarBiblioteca("vidros");
      const acessoriosData = await buscarBiblioteca("acessorios");

      setPerfis(perfisData);
      setVidros(vidrosData);
      setAcessorios(acessoriosData);
    } catch (error) {
      console.log("Erro ao carregar biblioteca", error);
    }
  };

  const adicionarItem = () => {
    const calculo = calcularTipologiaIndustrial({
      tipologia: tipologiaSelecionada,
      largura: Number(largura),
      altura: Number(altura),
      quantidade: Number(quantidade),
      linha,
      valorKg: Number(valorKg),
      valorVidro: Number(valorM2Vidro),
      valorAcessorios: Number(valorAcessorios),
      margem: Number(margem)
    });

    if (!calculo) {
      alert("Tipologia sem fórmula cadastrada no motor.");
      return;
    }

    const novoItem = {
      id: Date.now(),
      descricao: tipologiaSelecionada,
      linha,
      perfil: perfilSelecionado,
      vidro: vidroSelecionado,
      acessorio: acessorioSelecionado,
      largura: Number(largura),
      altura: Number(altura),
      quantidade: Number(quantidade),
      calculo
    };

    setItens([...itens, novoItem]);
  };

  const removerItem = (id) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const copiarItem = (item) => {
    setItens([
      ...itens,
      {
        ...item,
        id: Date.now()
      }
    ]);
  };

  const limparOrcamento = () => {
    setItens([]);
  };

  const resumo = useMemo(() => {
    return itens.reduce(
      (acc, item) => {
        acc.perfis += item.calculo.resumo.valorPerfis;
        acc.vidros += item.calculo.resumo.valorVidro;
        acc.acessorios += item.calculo.resumo.valorAcessorios;
        acc.subtotal += item.calculo.resumo.subtotal;
        acc.margem += item.calculo.resumo.margem;
        acc.total += item.calculo.resumo.valorFinal;
        return acc;
      },
      {
        perfis: 0,
        vidros: 0,
        acessorios: 0,
        subtotal: 0,
        margem: 0,
        total: 0
      }
    );
  }, [itens]);

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  return (
    <div style={styles.pagina}>
      <h1 style={styles.titulo}>Orçamento PRO Industrial</h1>
      <p style={styles.subtitulo}>R&A VIDROS E ESQUADRIAS</p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Dados do Orçamento</h2>

          <label style={styles.label}>Cliente</label>
          <input
            style={styles.input}
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nome do cliente"
          />

          <label style={styles.label}>Obra</label>
          <input
            style={styles.input}
            value={obra}
            onChange={(e) => setObra(e.target.value)}
            placeholder="Nome da obra"
          />

          <label style={styles.label}>Tipologia</label>
          <select
            style={styles.input}
            value={tipologiaSelecionada}
            onChange={(e) => setTipologiaSelecionada(e.target.value)}
          >
           {tipologias.map((tipo) => (
              <option
  key={tipo.id}
  value={tipo.nome}
>
  {tipo.nome}
              </option>
            ))}
          </select>
{tipologias.find(
  (t) =>
    t.nome ===
    tipologiaSelecionada
)?.imagem && (

  <img

    src={
      tipologias.find(
        (t) =>
          t.nome ===
          tipologiaSelecionada
      )?.imagem
    }

    alt=""

    style={{
      width: "100%",
      height: 220,
      objectFit: "cover",
      borderRadius: 15,
      marginTop: 15
    }}

  />

)}
          <label style={styles.label}>Linha</label>
          <select
            style={styles.input}
            value={linha}
            onChange={(e) => setLinha(e.target.value)}
          >
            <option value="Suprema">Suprema</option>
            <option value="Gold">Gold</option>
          </select>

          <div style={styles.duasColunas}>
            <div>
              <label style={styles.label}>Largura mm</label>
              <input
                style={styles.input}
                type="number"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Altura mm</label>
              <input
                style={styles.input}
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </div>
          </div>

          <label style={styles.label}>Quantidade</label>
          <input
            style={styles.input}
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <label style={styles.label}>Perfil</label>
          <select
            style={styles.input}
            value={perfilSelecionado}
            onChange={(e) => setPerfilSelecionado(e.target.value)}
          >
            <option value="">Selecione</option>
            {perfis.map((perfil) => (
              <option key={perfil.id} value={perfil.nome}>
                {perfil.codigo} - {perfil.nome}
              </option>
            ))}
          </select>

          <label style={styles.label}>Vidro</label>
          <select
            style={styles.input}
            value={vidroSelecionado}
            onChange={(e) => setVidroSelecionado(e.target.value)}
          >
            <option value="">Selecione</option>
            {vidros.map((vidro) => (
              <option key={vidro.id} value={vidro.nome}>
                {vidro.codigo} - {vidro.nome}
              </option>
            ))}
          </select>

          <label style={styles.label}>Acessório</label>
          <select
            style={styles.input}
            value={acessorioSelecionado}
            onChange={(e) => setAcessorioSelecionado(e.target.value)}
          >
            <option value="">Selecione</option>
            {acessorios.map((acessorio) => (
              <option key={acessorio.id} value={acessorio.nome}>
                {acessorio.codigo} - {acessorio.nome}
              </option>
            ))}
          </select>

          <button style={styles.botaoPrincipal} onClick={adicionarItem}>
            + Adicionar Item
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Custos Ajustáveis</h2>

          <label style={styles.label}>Alumínio R$/kg</label>
          <input
            style={styles.input}
            type="number"
            value={valorKg}
            onChange={(e) => setValorKg(e.target.value)}
          />

          <label style={styles.label}>Vidro R$/m²</label>
          <input
            style={styles.input}
            type="number"
            value={valorM2Vidro}
            onChange={(e) => setValorM2Vidro(e.target.value)}
          />

          <label style={styles.label}>Acessórios por peça</label>
          <input
            style={styles.input}
            type="number"
            value={valorAcessorios}
            onChange={(e) => setValorAcessorios(e.target.value)}
          />

          <label style={styles.label}>Margem por item</label>
          <input
            style={styles.input}
            type="number"
            value={margem}
            onChange={(e) => setMargem(e.target.value)}
          />

          <div style={styles.resumoBox}>
            <p>Perfis: {formatarMoeda(resumo.perfis)}</p>
            <p>Vidros: {formatarMoeda(resumo.vidros)}</p>
            <p>Acessórios: {formatarMoeda(resumo.acessorios)}</p>
            <h2>Total: {formatarMoeda(resumo.total)}</h2>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitulo}>Itens do Orçamento</h2>

        {itens.length === 0 && (
          <p style={styles.vazio}>Nenhum item adicionado ainda.</p>
        )}

        {itens.map((item) => (
          <div key={item.id} style={styles.item}>
            <div>
              <h3 style={styles.itemTitulo}>{item.descricao}</h3>
              <p>Linha: {item.linha}</p>
              <p>Perfil: {item.perfil || "-"}</p>
              <p>Vidro: {item.vidro || "-"}</p>
              <p>Acessório: {item.acessorio || "-"}</p>
              <p>
                Medida: {item.largura} x {item.altura} mm
              </p>
              <p>Quantidade: {item.quantidade}</p>

              <p>Área Vidro: {item.calculo.areaVidro.toFixed(2)} m²</p>
              <p>Kg Alumínio: {item.calculo.kgAluminio.toFixed(2)} kg</p>
              <p>Largura Folha: {item.calculo.larguraFolha.toFixed(0)} mm</p>
            </div>

            <div style={styles.itemValores}>
              <p>Perfis: {formatarMoeda(item.calculo.resumo.valorPerfis)}</p>
              <p>Vidro: {formatarMoeda(item.calculo.resumo.valorVidro)}</p>
              <p>
                Acessórios:{" "}
                {formatarMoeda(item.calculo.resumo.valorAcessorios)}
              </p>

              <h3>Total: {formatarMoeda(item.calculo.resumo.valorFinal)}</h3>

              <div style={styles.listaCorte}>
                <strong>Lista de Corte</strong>

                {item.calculo.listaCorte.map((peca, index) => (
                  <div key={index}>
                    {peca.perfil} - {peca.medida} mm - qtd {peca.quantidade}
                  </div>
                ))}
              </div>

              <button style={styles.botaoCopiar} onClick={() => copiarItem(item)}>
                Copiar
              </button>

              <button
                style={styles.botaoRemover}
                onClick={() => removerItem(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Lista Industrial de Alumínio</h2>

          {itens.map((item) => (
            <div key={`perfil-${item.id}`} style={styles.listaLinha}>
              <strong>{item.descricao}</strong>
              <p>Linha: {item.linha}</p>
              <p>Kg alumínio: {item.calculo.kgAluminio.toFixed(2)} kg</p>

              {item.calculo.listaCorte.map((peca, index) => (
                <p key={index}>
                  {peca.perfil}: {peca.medida} mm - qtd {peca.quantidade}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Lista Industrial de Vidros</h2>

          {itens.map((item) => (
            <div key={`vidro-${item.id}`} style={styles.listaLinha}>
              <strong>{item.descricao}</strong>
              <p>
                Peça: {item.largura} x {item.altura} mm
              </p>
              <p>Quantidade: {item.quantidade}</p>
              <p>Área total: {item.calculo.areaVidro.toFixed(2)} m²</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitulo}>Resumo Final</h2>

        <table style={styles.tabela}>
          <tbody>
            <tr>
              <td>Cliente</td>
              <td>{cliente || "-"}</td>
            </tr>
            <tr>
              <td>Obra</td>
              <td>{obra || "-"}</td>
            </tr>
            <tr>
              <td>Total de Itens</td>
              <td>{itens.length}</td>
            </tr>
            <tr>
              <td>Total Perfis</td>
              <td>{formatarMoeda(resumo.perfis)}</td>
            </tr>
            <tr>
              <td>Total Vidros</td>
              <td>{formatarMoeda(resumo.vidros)}</td>
            </tr>
            <tr>
              <td>Total Acessórios</td>
              <td>{formatarMoeda(resumo.acessorios)}</td>
            </tr>
            <tr>
              <td>Subtotal</td>
              <td>{formatarMoeda(resumo.subtotal)}</td>
            </tr>
            <tr>
              <td>Margem</td>
              <td>{formatarMoeda(resumo.margem)}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Geral</strong>
              </td>
              <td>
                <strong>{formatarMoeda(resumo.total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <button style={styles.botaoLimpar} onClick={limparOrcamento}>
          Limpar Orçamento
        </button>
      </div>
    </div>
  );
}

const styles = {
  pagina: {
    padding: "24px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a"
  },

  titulo: {
    fontSize: "30px",
    margin: 0,
    fontWeight: "800"
  },

  subtitulo: {
    color: "#475569",
    marginTop: "6px",
    marginBottom: "22px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
    marginBottom: "18px"
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
    marginBottom: "18px"
  },

  cardTitulo: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px"
  },

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "6px",
    marginTop: "12px",
    fontSize: "14px"
  },

  input: {
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box"
  },

  duasColunas: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },

  botaoPrincipal: {
    width: "100%",
    marginTop: "18px",
    padding: "13px",
    border: "none",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "15px"
  },

  resumoBox: {
    marginTop: "18px",
    padding: "14px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0"
  },

  vazio: {
    color: "#64748b",
    fontStyle: "italic"
  },

  item: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "12px"
  },

  itemTitulo: {
    marginTop: 0,
    fontSize: "18px"
  },

  itemValores: {
    textAlign: "right"
  },

  listaCorte: {
    marginTop: "12px",
    marginBottom: "12px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "left"
  },

  botaoCopiar: {
    padding: "9px 13px",
    marginRight: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },

  botaoRemover: {
    padding: "9px 13px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },

  listaLinha: {
    padding: "12px",
    borderRadius: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "10px"
  },

  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "16px"
  },

  botaoLimpar: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#334155",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer"
  }
};