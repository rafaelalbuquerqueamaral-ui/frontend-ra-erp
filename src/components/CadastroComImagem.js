import { useEffect, useState } from "react";
import API from "../config";

export default function CadastroComImagem({ titulo, tabela, campoPreco }) {
  const [lista, setLista] = useState([]);
  const [codigoBusca, setCodigoBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const r = await fetch(API + "/" + tabela);
    const d = await r.json();
    setLista(Array.isArray(d) ? d : []);
  }

  function buscarCodigo() {
    const achado = lista.find(
      (i) =>
        String(i.codigo || "").toLowerCase() ===
        codigoBusca.toLowerCase()
    );

    if (!achado) return alert("Código não encontrado");

    setSelecionado(achado);
    setNome(achado.nome || achado.tipo || "");
    setPreco(achado[campoPreco] || "");
    setImagem(achado.imagem || "");
  }

  async function enviarImagem(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const form = new FormData();
    form.append("imagem", arquivo);

    const r = await fetch(API + "/upload", {
      method: "POST",
      body: form,
    });

    const d = await r.json();

    if (d.caminho) {
      setImagem(API + d.caminho);
    }
  }

  async function salvarEdicao() {
    if (!selecionado) return alert("Busque um código primeiro");

    const r = await fetch(API + `/editar/${tabela}/${selecionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        [campoPreco]: Number(preco || 0),
        imagem,
      }),
    });

    const d = await r.json();

    if (!r.ok) return alert("Erro: " + d.erro);

    alert("Atualizado com sucesso ✅");
    setSelecionado(d);
    carregar();
  }

  return (
    <div style={page}>
      <h1>{titulo}</h1>

      <section style={card}>
        <h2>Buscar por Código</h2>

        <div style={linha}>
          <input
            style={input}
            placeholder="Digite o código"
            value={codigoBusca}
            onChange={(e) => setCodigoBusca(e.target.value)}
          />

          <button style={btnAzul} onClick={buscarCodigo}>
            Buscar Código
          </button>
        </div>
      </section>

      {selecionado && (
        <section style={card}>
          <h2>Editar Cadastro</h2>

          <div style={preview}>
            {imagem ? (
              <img src={imagem} alt="" style={imgPreview} />
            ) : (
              <div style={semImg}>Sem imagem</div>
            )}

            <div>
              <b>Código: {selecionado.codigo}</b>
              <p>{nome}</p>
            </div>
          </div>

          <label>Nome</label>
          <input
            style={input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Preço / Valor</label>
          <input
            style={input}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <label>Trocar Imagem</label>
          <input type="file" accept="image/*" onChange={enviarImagem} />

          <br />

          <button style={btnVerde} onClick={salvarEdicao}>
            Salvar Alterações
          </button>
        </section>
      )}

      <section style={card}>
        <h2>Lista Cadastrada</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Imagem</th>
              <th style={th}>Código</th>
              <th style={th}>Nome</th>
              <th style={th}>Valor</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((i) => (
              <tr key={i.id}>
                <td style={td}>
                  {i.imagem ? (
                    <img src={i.imagem} alt="" style={imgTabela} />
                  ) : (
                    "-"
                  )}
                </td>
                <td style={td}>{i.codigo}</td>
                <td style={td}>{i.nome || i.tipo}</td>
                <td style={td}>
                  R$ {Number(i[campoPreco] || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const page = { fontFamily: "Arial" };

const card = {
  background: "#fff",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
  marginBottom: 20,
};

const linha = {
  display: "flex",
  gap: 10,
};

const input = {
  width: "100%",
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  marginBottom: 12,
};

const btnAzul = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
};

const btnVerde = {
  ...btnAzul,
  background: "#16a34a",
  marginTop: 15,
};

const preview = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  background: "#f8fafc",
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
};

const imgPreview = {
  width: 120,
  height: 90,
  objectFit: "cover",
  borderRadius: 10,
};

const semImg = {
  width: 120,
  height: 90,
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#e2e8f0",
  border: "1px solid #cbd5e1",
  padding: 10,
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 10,
};

const imgTabela = {
  width: 70,
  height: 50,
  objectFit: "cover",
  borderRadius: 8,
};