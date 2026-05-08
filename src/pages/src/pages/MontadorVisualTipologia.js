import React, { useState } from "react";

export default function MontadorVisualTipologia() {

  const [materialSelecionado, setMaterialSelecionado] =
    useState(null);

  const [modulos, setModulos] = useState([
    {
      id: 1,
      x: 80,
      y: 80,
      largura: 320,
      altura: 220,
      nome: "Módulo 1",

      subdivisoes: [],
    },
  ]);

  const [draggingId, setDraggingId] =
    useState(null);

  const [resizeId, setResizeId] =
    useState(null);

  const [offset, setOffset] =
    useState({
      x: 0,
      y: 0,
    });

  function carregarMaterialSelecionado() {

    const salvo =
      localStorage.getItem(
        "materialSelecionado"
      );

    if (salvo) {

      setMaterialSelecionado(
        JSON.parse(salvo)
      );

    }

  }

  function adicionarModulo() {

    setModulos([
      ...modulos,

      {
        id: Date.now(),
        x: 120,
        y: 120,
        largura: 300,
        altura: 200,
        nome: "Novo módulo",

        subdivisoes: [],
      },
    ]);

  }

  function dividirVertical(id) {

    setModulos((mods) =>
      mods.map((m) => {

        if (m.id === id) {

          return {
            ...m,

            subdivisoes: [
              ...m.subdivisoes,

              {
                tipo: "vertical",
                posicao:
                  m.largura / 2,
              },
            ],
          };

        }

        return m;

      })
    );

  }

  function dividirHorizontal(id) {

    setModulos((mods) =>
      mods.map((m) => {

        if (m.id === id) {

          return {
            ...m,

            subdivisoes: [
              ...m.subdivisoes,

              {
                tipo: "horizontal",
                posicao:
                  m.altura / 2,
              },
            ],
          };

        }

        return m;

      })
    );

  }

  function iniciarDrag(
    e,
    modulo
  ) {

    e.stopPropagation();

    setDraggingId(modulo.id);

    setOffset({
      x: e.clientX - modulo.x,
      y: e.clientY - modulo.y,
    });

  }

  function iniciarResize(
    e,
    modulo
  ) {

    e.stopPropagation();

    setResizeId(modulo.id);

  }

  function moverMouse(e) {

    if (draggingId) {

      setModulos((mods) =>
        mods.map((m) => {

          if (m.id === draggingId) {

            return {
              ...m,

              x:
                e.clientX -
                offset.x,

              y:
                e.clientY -
                offset.y,
            };

          }

          return m;

        })
      );

    }

    if (resizeId) {

      setModulos((mods) =>
        mods.map((m) => {

          if (m.id === resizeId) {

            const novaLargura =
              e.clientX - m.x;

            const novaAltura =
              e.clientY - m.y;

            return {
              ...m,

              largura:
                novaLargura < 80
                  ? 80
                  : novaLargura,

              altura:
                novaAltura < 80
                  ? 80
                  : novaAltura,
            };

          }

          return m;

        })
      );

    }

  }

  function finalizar() {

    setDraggingId(null);

    setResizeId(null);

  }

  return (
    <div
      style={styles.page}
      onMouseMove={moverMouse}
      onMouseUp={finalizar}
    >

      <div style={styles.topo}>

        <h1>
          Montador Visual Industrial
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >

          <button
            style={styles.botao}
            onClick={
              carregarMaterialSelecionado
            }
          >
            Carregar Material
          </button>

          <button
            style={styles.botao}
            onClick={adicionarModulo}
          >
            + Módulo
          </button>

        </div>

      </div>

      <div style={styles.workspace}>

        <svg
          width="100%"
          height="100%"
        >

          {modulos.map((m) => (

            <g key={m.id}>

              <rect
                x={m.x}
                y={m.y}
                width={m.largura}
                height={m.altura}
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="3"
                rx="6"
                onMouseDown={(e) =>
                  iniciarDrag(e, m)
                }
                style={{
                  cursor: "move",
                }}
              />

              {m.subdivisoes.map((s, i) => {

                if (
                  s.tipo ===
                  "vertical"
                ) {

                  return (
                    <line
                      key={i}

                      x1={
                        m.x +
                        s.posicao
                      }

                      y1={m.y}

                      x2={
                        m.x +
                        s.posicao
                      }

                      y2={
                        m.y +
                        m.altura
                      }

                      stroke="#dc2626"
                      strokeWidth="3"
                    />
                  );

                }

                if (
                  s.tipo ===
                  "horizontal"
                ) {

                  return (
                    <line
                      key={i}

                      x1={m.x}

                      y1={
                        m.y +
                        s.posicao
                      }

                      x2={
                        m.x +
                        m.largura
                      }

                      y2={
                        m.y +
                        s.posicao
                      }

                      stroke="#dc2626"
                      strokeWidth="3"
                    />
                  );

                }

                return null;

              })}

              <text
                x={m.x + 12}
                y={m.y + 24}
                fontSize="16"
                fontWeight="bold"
                fill="#0f172a"
              >
                {m.nome}
              </text>

              {materialSelecionado && (

                <text
                  x={m.x + 12}
                  y={m.y + 50}
                  fontSize="13"
                  fill="#166534"
                  fontWeight="bold"
                >
                  {
                    materialSelecionado.nome
                  }
                </text>

              )}

              <text
                x={m.x + 10}
                y={
                  m.y +
                  m.altura +
                  18
                }
                fontSize="12"
                fill="#334155"
              >
                {Math.round(
                  m.largura
                )}{" "}
                mm
              </text>

              <text
                x={m.x - 45}
                y={
                  m.y +
                  m.altura / 2
                }
                fontSize="12"
                fill="#334155"
              >
                {Math.round(
                  m.altura
                )}{" "}
                mm
              </text>

              <rect
                x={
                  m.x +
                  m.largura -
                  10
                }

                y={
                  m.y +
                  m.altura -
                  10
                }

                width="20"
                height="20"

                fill="#1d4ed8"

                stroke="#fff"

                strokeWidth="2"

                rx="4"

                onMouseDown={(e) =>
                  iniciarResize(e, m)
                }

                style={{
                  cursor:
                    "nwse-resize",
                }}
              />

              <foreignObject
                x={m.x}
                y={m.y - 42}
                width="240"
                height="40"
              >

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                  }}
                >

                  <button
                    onClick={() =>
                      dividirVertical(
                        m.id
                      )
                    }
                  >
                    Dividir V
                  </button>

                  <button
                    onClick={() =>
                      dividirHorizontal(
                        m.id
                      )
                    }
                  >
                    Dividir H
                  </button>

                </div>

              </foreignObject>

            </g>

          ))}

        </svg>

      </div>

    </div>
  );
}

const styles = {

  page: {
    padding: 20,
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  topo: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  workspace: {
    background: "#fff",
    borderRadius: 20,
    height: "82vh",
    overflow: "hidden",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  botao: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 12,
    fontWeight: "bold",
    cursor: "pointer",
  },

};