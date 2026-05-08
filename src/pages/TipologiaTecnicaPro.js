import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./TipologiaTecnicaPro.css";

const calcularFormula = (formula, vars) => {
  try {
    const { L, H, QF, PERIMETRO } = vars;

    if (!formula) return 0;

    return Function(
      "L",
      "H",
      "QF",
      "PERIMETRO",
      `return ${formula};`
    )(L, H, QF, PERIMETRO);
  } catch {
    return 0;
  }
};

export default function TipologiaTecnicaPro() {
  const [aba, setAba] = useState("perfis");
  const [perfisBase, setPerfisBase] = useState([]);

  const [tipologia, setTipologia] = useState({
    nome: "JANELA DE CORRER 2 FOLHAS",
    codigo: "LG-JCR200",
    linha: "Gold",
    largura: 1200,
    altura: 1200,
    quantidadeFolhas: 2,
    observacao: "",
  });

  const [perfis, setPerfis] = useState([
    {
      perfil_id: "",
      codigo: "",
      descricao: "",
      imagem: "",
      formula: "L",
      qtde: 2,
      corte: "45°",
      condicao: "",
      modulo: "Marco",
      resultado: 0,
    },
  ]);

  const [acessorios, setAcessorios] = useState([
    {
      nome: "Roldana",
      qtde: 2,
      valor: 0,
      observacao: "",
    },
  ]);

  const [vidros, setVidros] = useState([
    {
      nome: "Vidro temperado",
      espessura: "8mm",
      formula: "L * H",
      qtde: 1,
      resultado: 0,
    },
  ]);

  useEffect(() => {
    carregarPerfis();
  }, []);

  async function carregarPerfis() {
    try {
      const res = await api.get("/perfis");
      setPerfisBase(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setPerfisBase([]);
    }
  }

  function variaveis() {
    const L = Number(tipologia.largura || 0) / 1000;
    const H = Number(tipologia.altura || 0) / 1000;
    const QF = Number(tipologia.quantidadeFolhas || 1);
    const PERIMETRO = 2 * L + 2 * H;

    return { L, H, QF, PERIMETRO };
  }

  function recalcular() {
    const vars = variaveis();

    setPerfis(
      perfis.map((p) => ({
        ...p,
        resultado: calcularFormula(p.formula, vars) * Number(p.qtde || 1),
      }))
    );

    setVidros(
      vidros.map((v) => ({
        ...v,
        resultado: calcularFormula(v.formula, vars) * Number(v.qtde || 1),
      }))
    );
  }

  function selecionarPerfil(index, id) {
    const perfil = perfisBase.find((p) => Number(p.id) === Number(id));
    const lista = [...perfis];

    lista[index] = {
      ...lista[index],
      perfil_id: id,
      codigo: perfil?.codigo || "",
      descricao: perfil?.nome || perfil?.descricao || "",
      imagem: perfil?.imagem || "",
    };

    setPerfis(lista);
  }

  function alterarPerfil(index, campo, valor) {
    const lista = [...perfis];
    lista[index][campo] = valor;
    setPerfis(lista);
  }

  function adicionarPerfil() {
    setPerfis([
      ...perfis,
      {
        perfil_id: "",
        codigo: "",
        descricao: "",
        imagem: "",
        formula: "L",
        qtde: 1,
        corte: "",
        condicao: "",
        modulo: "",
        resultado: 0,
      },
    ]);
  }

  function alterarAcessorio(index, campo, valor) {
    const lista = [...acessorios];
    lista[index][campo] = valor;
    setAcessorios(lista);
  }

  function adicionarAcessorio() {
    setAcessorios([
      ...acessorios,
      {
        nome: "",
        qtde: 1,
        valor: 0,
        observacao: "",
      },
    ]);
  }

  function alterarVidro(index, campo, valor) {
    const lista = [...vidros];
    lista[index][campo] = valor;
    setVidros(lista);
  }

  function adicionarVidro() {
    setVidros([
      ...vidros,
      {
        nome: "",
        espessura: "",
        formula: "L * H",
        qtde: 1,
        resultado: 0,
      },
    ]);
  }

  async function salvarTipologia() {
    try {
      await api.post("/tipologias", {
        nome: tipologia.nome,
        linha: tipologia.linha,
        largura_padrao: tipologia.largura,
        altura_padrao: tipologia.altura,
        observacao_tecnica: tipologia.observacao,
        desenho_json: {
          codigo: tipologia.codigo,
          quantidadeFolhas: tipologia.quantidadeFolhas,
          perfis,
          acessorios,
          vidros,
          variaveis: variaveis(),
        },
      });

      alert("Tipologia técnica salva no PostgreSQL!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar tipologia técnica.");
    }
  }

  const vars = variaveis();

  return (
    <div className="tipologia-pro">
      <div className="topo">
        <div>
          <h1>{tipologia.codigo}</h1>
          <p>{tipologia.nome} - LINHA {tipologia.linha}</p>
        </div>

        <div>
          <button className="btn-recalcular" onClick={recalcular}>
            Recalcular
          </button>

          <button className="btn-salvar" onClick={salvarTipologia}>
            Salvar no PostgreSQL
          </button>
        </div>
      </div>

      <div className="painel">
        <h2>Dados da Tipologia</h2>

        <div className="form-grid">
          <input
            placeholder="Código"
            value={tipologia.codigo}
            onChange={(e) =>
              setTipologia({ ...tipologia, codigo: e.target.value })
            }
          />

          <input
            placeholder="Nome"
            value={tipologia.nome}
            onChange={(e) =>
              setTipologia({ ...tipologia, nome: e.target.value })
            }
          />

          <select
            value={tipologia.linha}
            onChange={(e) =>
              setTipologia({ ...tipologia, linha: e.target.value })
            }
          >
            <option>Gold</option>
            <option>Suprema</option>
            <option>Integrada</option>
            <option>Especial</option>
          </select>

          <input
            type="number"
            placeholder="Largura mm"
            value={tipologia.largura}
            onChange={(e) =>
              setTipologia({ ...tipologia, largura: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Altura mm"
            value={tipologia.altura}
            onChange={(e) =>
              setTipologia({ ...tipologia, altura: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Qtd folhas"
            value={tipologia.quantidadeFolhas}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                quantidadeFolhas: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="desenho-card">
        <h2>Desenho Técnico da Tipologia</h2>

        <div className="desenho-tipologia">
          <div className="folha esquerda">
            <span>FOLHA 1</span>
          </div>

          <div className="folha direita">
            <span>FOLHA 2</span>
          </div>

          <div className="cota-largura">{tipologia.largura} mm</div>
          <div className="cota-altura">{tipologia.altura} mm</div>
        </div>
      </div>

      <div className="variaveis">
        <div>
          <strong>L</strong>
          <span>{vars.L.toFixed(3)} m</span>
        </div>

        <div>
          <strong>H</strong>
          <span>{vars.H.toFixed(3)} m</span>
        </div>

        <div>
          <strong>QF</strong>
          <span>{vars.QF}</span>
        </div>

        <div>
          <strong>PERÍMETRO</strong>
          <span>{vars.PERIMETRO.toFixed(3)} m</span>
        </div>
      </div>

      <div className="abas">
        <button
          className={aba === "perfis" ? "ativo" : ""}
          onClick={() => setAba("perfis")}
        >
          Perfis
        </button>

        <button
          className={aba === "acessorios" ? "ativo" : ""}
          onClick={() => setAba("acessorios")}
        >
          Acessórios
        </button>

        <button
          className={aba === "vidros" ? "ativo" : ""}
          onClick={() => setAba("vidros")}
        >
          Vidros / Chapas
        </button>
      </div>

      {aba === "perfis" && (
        <div className="painel">
          <div className="barra">
            <button onClick={adicionarPerfil}>+ Adicionar Perfil</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Perfil</th>
                <th>Código</th>
                <th>Descrição</th>
                <th>Fórmula</th>
                <th>Qtde</th>
                <th>Corte</th>
                <th>Módulo</th>
                <th>Resultado</th>
              </tr>
            </thead>

            <tbody>
              {perfis.map((item, i) => (
                <tr key={i}>
                  <td>
                    {item.imagem ? (
                      <img
                        className="img-perfil"
                        src={
                          item.imagem.startsWith("http")
                            ? item.imagem
                            : `https://backend-esquadrias.onrender.com${item.imagem}`
                        }
                        alt=""
                      />
                    ) : (
                      <div className="sem-img">Sem imagem</div>
                    )}
                  </td>

                  <td>
                    <select
                      value={item.perfil_id}
                      onChange={(e) => selecionarPerfil(i, e.target.value)}
                    >
                      <option value="">Selecionar</option>
                      {perfisBase.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.codigo} - {p.nome || p.descricao}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>{item.codigo}</td>

                  <td>{item.descricao}</td>

                  <td>
                    <input
                      value={item.formula}
                      onChange={(e) =>
                        alterarPerfil(i, "formula", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.qtde}
                      onChange={(e) =>
                        alterarPerfil(i, "qtde", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.corte}
                      onChange={(e) =>
                        alterarPerfil(i, "corte", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.modulo}
                      onChange={(e) =>
                        alterarPerfil(i, "modulo", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <strong>{Number(item.resultado || 0).toFixed(3)} m</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "acessorios" && (
        <div className="painel">
          <div className="barra">
            <button onClick={adicionarAcessorio}>+ Adicionar Acessório</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Qtde</th>
                <th>Valor</th>
                <th>Observação</th>
              </tr>
            </thead>

            <tbody>
              {acessorios.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      value={item.nome}
                      onChange={(e) =>
                        alterarAcessorio(i, "nome", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.qtde}
                      onChange={(e) =>
                        alterarAcessorio(i, "qtde", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.valor}
                      onChange={(e) =>
                        alterarAcessorio(i, "valor", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.observacao}
                      onChange={(e) =>
                        alterarAcessorio(i, "observacao", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "vidros" && (
        <div className="painel">
          <div className="barra">
            <button onClick={adicionarVidro}>+ Adicionar Vidro</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Vidro</th>
                <th>Espessura</th>
                <th>Fórmula</th>
                <th>Qtde</th>
                <th>Resultado</th>
              </tr>
            </thead>

            <tbody>
              {vidros.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      value={item.nome}
                      onChange={(e) =>
                        alterarVidro(i, "nome", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.espessura}
                      onChange={(e) =>
                        alterarVidro(i, "espessura", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.formula}
                      onChange={(e) =>
                        alterarVidro(i, "formula", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.qtde}
                      onChange={(e) =>
                        alterarVidro(i, "qtde", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <strong>{Number(item.resultado || 0).toFixed(3)} m²</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}