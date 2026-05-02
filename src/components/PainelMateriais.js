import { useState } from "react";

const API = "http://localhost:3001";

export default function PainelMateriais() {
  const [codigo, setCodigo] = useState("");
  const [item, setItem] = useState(null);
  const [lista, setLista] = useState([]);

  // 🔎 Buscar item pelo código
  async function buscarCodigo() {
    const res = await fetch(`${API}/materiais/codigo/${codigo}`);
    const data = await res.json();

    setItem(data);
  }

  // ➕ Adicionar na lista
  function adicionarItem() {
    if (!item) return;

    setLista([
      ...lista,
      {
        ...item,
        quantidade: 1,
      },
    ]);

    setCodigo("");
    setItem(null);
  }

  // ✏️ editar campo
  function editar(index, campo, valor) {
    const nova = [...lista];
    nova[index][campo] = valor;
    setLista(nova);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Materiais da Tipologia</h2>

      {/* 🔎 BUSCA */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Digite o código (ex: LG-002)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <button onClick={buscarCodigo}>Buscar</button>
        <button onClick={adicionarItem}>Adicionar</button>
      </div>

      {/* 📦 RESULTADO */}
      {item && (
        <div style={{ marginTop: 20 }}>
          <img src={`${API}/${item.imagem}`} width={80} />
          <p>{item.nome}</p>
        </div>
      )}

      {/* 📋 LISTA */}
      <table style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Código</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Qtd</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((i, index) => (
            <tr key={index}>
              <td>
                <img src={`${API}/${i.imagem}`} width={50} />
              </td>

              <td>{i.codigo}</td>

              <td>
                <input
                  value={i.nome}
                  onChange={(e) =>
                    editar(index, "nome", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={i.preco}
                  onChange={(e) =>
                    editar(index, "preco", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={i.quantidade}
                  onChange={(e) =>
                    editar(index, "quantidade", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}