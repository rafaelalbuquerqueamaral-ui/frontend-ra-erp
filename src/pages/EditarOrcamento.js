import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarOrcamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [itens, setItens] = useState([]);

  useEffect(() => {
    carregarClientes();
    carregarOrcamento();
  }, []);

  async function carregarClientes() {
    try {
      const resposta = await fetch("http://localhost:3001/clientes");
      const data = await resposta.json();
      setClientes(data);
    } catch (error) {
      console.log("Erro ao carregar clientes:", error);
      alert("Erro ao carregar clientes");
    }
  }

  async function carregarOrcamento() {
    try {
      const resposta = await fetch(`http://localhost:3001/orcamentos/${id}`);
      const data = await resposta.json();

      if (!resposta.ok) {
        alert(data.erro || "Erro ao carregar orçamento");
        return;
      }

      setCliente(data.cliente || "");
      setItens(data.itens || []);
    } catch (error) {
      console.log("Erro ao carregar orçamento:", error);
      alert("Erro ao carregar orçamento");
    }
  }

  function adicionarItem() {
    const l = parseFloat(String(largura).replace(",", "."));
    const a = parseFloat(String(altura).replace(",", "."));

    if (isNaN(l) || isNaN(a) || l <= 0 || a <= 0) {
      alert("Preencha largura e altura corretamente");
      return;
    }

    const valor = l * a * 120;

    const novoItem = {
      id: Date.now(),
      largura: l,
      altura: a,
      valor,
    };

    setItens((prev) => [...prev, novoItem]);
    setLargura("");
    setAltura("");
  }

  function excluirItem(idItem) {
    setItens((prev) => prev.filter((item) => item.id !== idItem));
  }

  const total = itens.reduce((soma, item) => soma + item.valor, 0);

  async function salvar() {
    try {
      if (!cliente) {
        alert("Selecione o cliente");
        return;
      }

      if (itens.length === 0) {
        alert("Adicione pelo menos 1 item");
        return;
      }

      const resposta = await fetch(`http://localhost:3001/orcamentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente,
          valor: total,
          itens,
        }),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        alert(data.erro || "Erro ao atualizar orçamento");
        return;
      }

      alert("Orçamento atualizado com sucesso");
      navigate("/orcamentos");
    } catch (error) {
      console.log("Erro ao atualizar orçamento:", error);
      alert("Erro ao atualizar orçamento");
    }
  }

  return (
    <div>
      <h1>Editar Orçamento</h1>

      <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
        <option value="">Selecione o cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.nome}>
            {c.nome}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        step="any"
        placeholder="Largura"
        value={largura}
        onChange={(e) => setLargura(e.target.value)}
      />

      <input
        type="number"
        step="any"
        placeholder="Altura"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <br /><br />

      <button onClick={adicionarItem}>
        + Adicionar Item
      </button>

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Largura</th>
            <th>Altura</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id}>
              <td>{item.largura}</td>
              <td>{item.altura}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              <td>
                <button onClick={() => excluirItem(item.id)}>
                  Excluir Item
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: R$ {total.toFixed(2)}</h2>

      <br />

      <button onClick={salvar}>
        Salvar Alterações
      </button>
    </div>
  );
}