import React, { useEffect, useMemo, useState } from "react";
import { calcularMateriais } from "../services/MotorCalculo";
import {
  calcularMateriaisTipologia,
  calcularBarras,
  calcularVidroM2
} from "../utils/calculoIndustrial";
const API = "http://localhost:3001";

export default function Orcamentos() {
  const [clientes, setClientes] = useState([]);
  const [tipologias, setTipologias] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [clienteId, setClienteId] = useState("");
  const [obraId, setObraId] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [observacoes, setObservacoes] = useState("");

  const [itens, setItens] = useState([
    {
      tipologia_id: "",
      descricao: "",
      largura: "",
      altura: "",
      quantidade: 1,
      valor_unitario: 0,
      materiais_calculados: [],
    },
  ]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [rClientes, rTipologias, rOrcamentos] = await Promise.all([
        fetch(`${API}/clientes`),
        fetch(`${API}/tipologias`),
        fetch(`${API}/orcamentos`),
      ]);

      setClientes(await rClientes.json());
      setTipologias(await rTipologias.json());
      setOrcamentos(await rOrcamentos.json());
    } catch (error) {
      setMensagem("Erro ao carregar dados. Verifique backend e PostgreSQL.");
    }
  }

  async function buscarMateriaisDaTipologia(tipologiaId, largura, altura) {
    try {
      const res = await fetch(`${API}/tipologias/${tipologiaId}/materiais`);
      const materiais = await res.json();

      return calcularMateriais(
        Array.isArray(materiais) ? materiais : [],
        Number(largura || 0),
        Number(altura || 0)
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function atualizarItem(index, campo, valor) {
    const novos = [...itens];
    novos[index][campo] = valor;

    if (campo === "tipologia_id") {
      const tipologia = tipologias.find((t) => String(t.id) === String(valor));

      if (tipologia) {
        novos[index].descricao = tipologia.nome || "";
        novos[index].valor_unitario = Number(tipologia.preco_base || 0);
      }
    }

    const item = novos[index];

    if (
      item.tipologia_id &&
      Number(item.largura || 0) > 0 &&
      Number(item.altura || 0) > 0
    ) {
      novos[index].materiais_calculados = await buscarMateriaisDaTipologia(
        item.tipologia_id,
        item.largura,
        item.altura
      );
    }

    setItens(novos);
  }

  function adicionarItem() {
    setItens([
      ...itens,
      {
        tipologia_id: "",
        descricao: "",
        largura: "",
        altura: "",
        quantidade: 1,
        valor_unitario: 0,
        materiais_calculados: [],
      },
    ]);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  const subtotal = useMemo(() => {
    return itens.reduce((total, item) => {
      return total + Number(item.quantidade || 0) * Number(item.valor_unitario || 0);
    }, 0);
  }, [itens]);

  const total = subtotal - Number(desconto || 0);

  async function salvarOrcamento(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const payload = {
        cliente_id: clienteId || null,
        obra_id: obraId || null,
        desconto: Number(desconto || 0),
        observacoes,
        itens: itens.map((item) => ({
          tipologia_id: item.tipologia_id || null,
          descricao: item.descricao,
          largura: Number(item.largura || 0),
          altura: Number(item.altura || 0),
          quantidade: Number(item.quantidade || 1),
          valor_unitario: Number(item.valor_unitario || 0),
        })),
      };

      const res = await fetch(`${API}/orcamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || "Erro ao salvar orçamento");

      setMensagem("Orçamento salvo com sucesso!");

      setClienteId("");
      setObraId("");
      setDesconto(0);
      setObservacoes("");
      setItens([
        {
          tipologia_id: "",
          descricao: "",
          largura: "",
          altura: "",
          quantidade: 1,
          valor_unitario: 0,
          materiais_calculados: [],
        },
      ]);

      carregarDados();
    } catch (error) {
      setMensagem(error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function excluirOrcamento(id) {
    if (!window.confirm("Excluir este orçamento?")) return;

    try {
      await fetch(`${API}/orcamentos/${id}`, { method: "DELETE" });
      carregarDados();
    } catch {
      setMensagem("Erro ao excluir orçamento.");
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Orçamentos</h1>
      <p style={styles.subtitle}>
        Orçamento técnico com tipologia inteligente e lista automática de materiais.
      </p>

      {mensagem && <div style={styles.alert}>{mensagem}</div>}

      <form onSubmit={salvarOrcamento} style={styles.card}>
        <h2>Novo orçamento</h2>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Cliente</label>
            <select
              style={styles.input}
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Obra ID</label>
            <input
              style={styles.input}
              value={obraId}
              onChange={(e) => setObraId(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div>
            <label style={styles.label}>Desconto</label>
            <input
              style={styles.input}
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
            />
          </div>
        </div>

        <h3>Itens</h3>

        {itens.map((item, index) => (
          <div key={index} style={styles.itemBox}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Tipologia</label>
                <select
                  style={styles.input}
                  value={item.tipologia_id}
                  onChange={(e) =>
                    atualizarItem(index, "tipologia_id", e.target.value)
                  }
                >
                  <option value="">Selecione</option>
                  {tipologias.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} {t.linha ? `- ${t.linha}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.label}>Descrição</label>
                <input
                  style={styles.input}
                  value={item.descricao}
                  onChange={(e) =>
                    atualizarItem(index, "descricao", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Largura mm</label>
                <input
                  style={styles.input}
                  type="number"
                  value={item.largura}
                  onChange={(e) =>
                    atualizarItem(index, "largura", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Altura mm</label>
                <input
                  style={styles.input}
                  type="number"
                  value={item.altura}
                  onChange={(e) =>
                    atualizarItem(index, "altura", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Qtd</label>
                <input
                  style={styles.input}
                  type="number"
                  value={item.quantidade}
                  onChange={(e) =>
                    atualizarItem(index, "quantidade", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Valor unitário</label>
                <input
                  style={styles.input}
                  type="number"
                  value={item.valor_unitario}
                  onChange={(e) =>
                    atualizarItem(index, "valor_unitario", e.target.value)
                  }
                />
              </div>
            </div>

            <div style={styles.itemFooter}>
              <strong>
                Total item: R${" "}
                {(
                  Number(item.quantidade || 0) * Number(item.valor_unitario || 0)
                ).toFixed(2)}
              </strong>

              <button
                type="button"
                style={styles.dangerBtn}
                onClick={() => removerItem(index)}
              >
                Remover
              </button>
            </div>

            {item.materiais_calculados?.length > 0 && (
              <div style={styles.listaMateriais}>
                <h4>Lista automática de materiais</h4>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Tipo</th>
                      <th style={styles.th}>Material</th>
                      <th style={styles.th}>Largura</th>
                      <th style={styles.th}>Altura</th>
                      <th style={styles.th}>Qtd</th>
                      <th style={styles.th}>Un</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item.materiais_calculados.map((m, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{m.tipo}</td>
                        <td style={styles.td}>{m.nome_material}</td>
                        <td style={styles.td}>{m.largura_calculada}</td>
                        <td style={styles.td}>{m.altura_calculada}</td>
                        <td style={styles.td}>{m.quantidade_calculada}</td>
                        <td style={styles.td}>{m.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        <button type="button" style={styles.secondaryBtn} onClick={adicionarItem}>
          + Adicionar item
        </button>

        <div>
          <label style={styles.label}>Observações</label>
          <textarea
            style={{ ...styles.input, minHeight: 80 }}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <div style={styles.totalBox}>
          <div>Subtotal: R$ {subtotal.toFixed(2)}</div>
          <div>Desconto: R$ {Number(desconto || 0).toFixed(2)}</div>
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>

        <button type="submit" style={styles.primaryBtn} disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar orçamento"}
        </button>
      </form>

      <div style={styles.card}>
        <h2>Orçamentos salvos</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Subtotal</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {orcamentos.map((o) => (
              <tr key={o.id}>
                <td style={styles.td}>{o.id}</td>
                <td style={styles.td}>{o.cliente_nome || "-"}</td>
                <td style={styles.td}>{o.status}</td>
                <td style={styles.td}>R$ {Number(o.subtotal || 0).toFixed(2)}</td>
                <td style={styles.td}>R$ {Number(o.total || 0).toFixed(2)}</td>
                <td style={styles.td}>
                  <button
                    style={styles.dangerBtn}
                    onClick={() => excluirOrcamento(o.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {orcamentos.length === 0 && (
              <tr>
                <td style={styles.td} colSpan="6">
                  Nenhum orçamento salvo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    background: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    margin: 0,
    fontSize: 30,
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: 6,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  itemBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#fafafa",
    padding: 14,
    marginBottom: 16,
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  listaMateriais: {
    marginTop: 16,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 14,
    overflowX: "auto",
  },
  primaryBtn: {
    marginTop: 16,
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 16,
  },
  dangerBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  totalBox: {
    marginTop: 18,
    background: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    display: "grid",
    gap: 6,
    fontSize: 16,
  },
  alert: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#111827",
    color: "#fff",
    textAlign: "left",
    padding: 10,
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
  },
};