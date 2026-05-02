import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NovoCliente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  async function salvar() {
    try {
      if (!nome.trim()) {
        alert("Informe o nome do cliente");
        return;
      }

      const resposta = await fetch("http://localhost:3001/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
        }),
      });

      const texto = await resposta.text();

      let dados = {};
      try {
        dados = JSON.parse(texto);
      } catch (e) {
        console.log("Resposta não é JSON:", e);
      }

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao salvar cliente");
        return;
      }

      alert("Cliente salvo com sucesso");
      navigate("/clientes");
    } catch (error) {
      console.log("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente");
    }
  }

  return (
    <div>
      <h1>Novo Cliente</h1>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={salvar}>
        Salvar Cliente
      </button>
    </div>
  );
}