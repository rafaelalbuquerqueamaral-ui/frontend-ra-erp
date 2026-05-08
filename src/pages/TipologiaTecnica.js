import React, { useEffect, useState } from "react";

export default function TipologiaTecnica() {
  const [aba, setAba] = useState("perfis");

  const [tipologia, setTipologia] = useState({
    nome: "",
    linha: "LINHA GOLD",
    largura: 1200,
    altura: 1000,
    observacao: "",
  });

  const [perfis, setPerfis] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [vidros, setVidros] = useState([]);

  useEffect(() => {
    carregarPerfis();
    carregarVidros();
  }, []);

  async function carregarPerfis() {
    try {
      const r = await fetch("http://localhost:3001/perfis");
      const data = await r.json();
      setPerfis(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function carregarVidros() {
    try {
      const r = await fetch("http://localhost:3001/vidros");
      const data = await r.json();
      setVidros(data);
    } catch (err) {
      console.log(err);
    }
  }

  function adicionarPerfil() {
    setPerfis([
      ...perfis,
      {
        codigo: "",
        descricao: "",
        formula: "L",
        qtd: 1,
        corte: "90/90",
        imagem: "",
      },
    ]);
  }

  function adicionarAcessorio() {
    setAcessorios([
      ...acessorios,
      {
        nome: "",
        qtd: 1,
        valor: 0,
      },
    ]);
  }

  function adicionarVidro() {
    setVidros([
      ...vidros,
      {
        nome: "",
        espessura: "",
        valor_m2: 0,
      },
    ]);
  }

  async function salvarTipologia() {
    try {
      const body = {
        nome: tipologia.nome,
        linha: tipologia.linha,
        largura_padrao: tipologia.largura,
        altura_padrao: tipologia.altura,
        observacao_tecnica: tipologia.observacao,

        desenho_json: {
          perfis,
          acessorios,
          vidros,
        },
      };

      const r = await fetch("http://localhost:3001/tipologias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await r.json();

      if (data.erro) {
        alert(data.erro);
        return;
      }

      alert("Tipologia salva com sucesso");
    } catch (err) {
      console.log(err);
      alert("Erro ao salvar");
    }
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#f5f7f2",
        minHeight: "100vh",
      }}
    >
      <h1>{tipologia.nome || "NOVA TIPOLOGIA"}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button onClick={() => setAba("perfis")}>
              Perfis
            </button>

            <button onClick={() => setAba("acessorios")}>
              Acessórios
            </button>

            <button onClick={() => setAba("vidros")}>
              Vidros
            </button>

            <button onClick={() => setAba("desenho")}>
              Desenho Técnico
            </button>

            <button onClick={() => setAba("variaveis")}>
              Variáveis
            </button>
          </div>

          {aba === "perfis" && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <button onClick={adicionarPerfil}>
                + Adicionar Perfil
              </button>

              <table
                style={{
                  width: "100%",
                  marginTop: 20,
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Perfil</th>
                    <th>Fórmula</th>
                    <th>Qtd</th>
                    <th>Corte</th>
                    <th>Descrição</th>
                  </tr>
                </thead>

                <tbody>
                  {perfis.map((p, i) => (
                    <tr key={i}>
                      <td>
                        {p.imagem ? (
                          <img
                            src={p.imagem}
                            alt=""
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </td>

                      <td>
                        <input
                          value={p.codigo}
                          onChange={(e) => {
                            const lista = [...perfis];
                            lista[i].codigo = e.target.value;
                            setPerfis(lista);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          value={p.formula}
                          onChange={(e) => {
                            const lista = [...perfis];
                            lista[i].formula = e.target.value;
                            setPerfis(lista);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          value={p.qtd}
                          onChange={(e) => {
                            const lista = [...perfis];
                            lista[i].qtd = e.target.value;
                            setPerfis(lista);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          value={p.corte}
                          onChange={(e) => {
                            const lista = [...perfis];
                            lista[i].corte = e.target.value;
                            setPerfis(lista);
                          }}
                        />
                      </td>

                      <td>
                        <input
                          value={p.descricao}
                          onChange={(e) => {
                            const lista = [...perfis];
                            lista[i].descricao = e.target.value;
                            setPerfis(lista);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {aba === "acessorios" && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <button onClick={adicionarAcessorio}>
                + Adicionar Acessório
              </button>

              {acessorios.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <input
                    placeholder="Nome"
                    value={a.nome}
                    onChange={(e) => {
                      const lista = [...acessorios];
                      lista[i].nome = e.target.value;
                      setAcessorios(lista);
                    }}
                  />

                  <input
                    placeholder="Qtd"
                    value={a.qtd}
                    onChange={(e) => {
                      const lista = [...acessorios];
                      lista[i].qtd = e.target.value;
                      setAcessorios(lista);
                    }}
                  />

                  <input
                    placeholder="Valor"
                    value={a.valor}
                    onChange={(e) => {
                      const lista = [...acessorios];
                      lista[i].valor = e.target.value;
                      setAcessorios(lista);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {aba === "vidros" && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <button onClick={adicionarVidro}>
                + Adicionar Vidro
              </button>

              {vidros.map((v, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <input
                    placeholder="Vidro"
                    value={v.nome}
                    onChange={(e) => {
                      const lista = [...vidros];
                      lista[i].nome = e.target.value;
                      setVidros(lista);
                    }}
                  />

                  <input
                    placeholder="Espessura"
                    value={v.espessura}
                    onChange={(e) => {
                      const lista = [...vidros];
                      lista[i].espessura = e.target.value;
                      setVidros(lista);
                    }}
                  />

                  <input
                    placeholder="Valor m²"
                    value={v.valor_m2}
                    onChange={(e) => {
                      const lista = [...vidros];
                      lista[i].valor_m2 = e.target.value;
                      setVidros(lista);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {aba === "desenho" && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <h2>Desenho Técnico</h2>

              <div
                style={{
                  width: 300,
                  height: 300,
                  border: "4px solid #111",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRight: "4px solid #111",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "45%",
                      left: "40%",
                      fontSize: 40,
                    }}
                  >
                    →
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "45%",
                      left: "40%",
                      fontSize: 40,
                    }}
                  >
                    ←
                  </div>
                </div>
              </div>
            </div>
          )}

          {aba === "variaveis" && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <h2>Variáveis Automáticas</h2>

              <div>L = Largura</div>
              <div>H = Altura</div>
              <div>L-28</div>
              <div>H-52</div>
              <div>(L-136)/2</div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              onClick={salvarTipologia}
              style={{
                background: "#003b7a",
                color: "#fff",
                padding: 15,
                border: 0,
                borderRadius: 10,
                width: 250,
                fontWeight: "bold",
              }}
            >
              SALVAR TIPOLOGIA
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <h3>Dados Técnicos</h3>

          <input
            placeholder="Nome"
            value={tipologia.nome}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                nome: e.target.value,
              })
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <input
            placeholder="Linha"
            value={tipologia.linha}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                linha: e.target.value,
              })
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <input
            placeholder="Largura"
            value={tipologia.largura}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                largura: e.target.value,
              })
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <input
            placeholder="Altura"
            value={tipologia.altura}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                altura: e.target.value,
              })
            }
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 10,
            }}
          />

          <textarea
            placeholder="Observação Técnica"
            value={tipologia.observacao}
            onChange={(e) =>
              setTipologia({
                ...tipologia,
                observacao: e.target.value,
              })
            }
            style={{
              width: "100%",
              height: 120,
              padding: 10,
            }}
          />
        </div>
      </div>
    </div>
  );
}