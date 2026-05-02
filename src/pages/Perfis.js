import { useEffect, useState } from "react";

export default function Perfis() {
  const API = "http://localhost:3001";

  const vazio = {
    codigo: "",
    descricao: "",
    peso_kg_m: "",
    barra: 6000,
    linha: "Gold",
    referencia: "DIVERSOS",
    tipo: "Marco",
    valor_kg: "",
    imagem: "",
  };

  const [perfis, setPerfis] = useState([]);
  const [form, setForm] = useState(vazio);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const r = await fetch(`${API}/perfis`);
    const d = await r.json();
    setPerfis(Array.isArray(d) ? d : []);
  }

  async function salvar() {
    if (!form.codigo || !form.descricao) {
      alert("Digite código e descrição");
      return;
    }

    await fetch(`${API}/perfis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(vazio);
    carregar();
  }

  const lista = perfis.filter((p) =>
    `${p.codigo || ""} ${p.descricao || ""} ${p.nome || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div style={pagina}>
      <div style={topo}>
        <input
          style={buscaInput}
          placeholder="Digite o código"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button style={btnAzul}>Buscar Código</button>
        <button style={btnPreto}>Novo Perfil</button>
      </div>

      <div style={grid}>
        <div style={card}>
          <h2>Novo Perfil</h2>

          <div style={preview}>
            <div style={boxImg}>
              {form.imagem ? (
                <img src={form.imagem} alt="" width="80" />
              ) : (
                "Imagem"
              )}
            </div>

            <div>
              <b>{form.descricao || "Nome do perfil"}</b>
              <p>{form.codigo || "Código"}</p>
              <small>
                {form.linha} • {form.tipo}
              </small>
            </div>
          </div>

          <input
            style={input}
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />

          <input
            style={input}
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <select
            style={input}
            value={form.linha}
            onChange={(e) => setForm({ ...form, linha: e.target.value })}
          >
            <option>Gold</option>
            <option>Suprema</option>
            <option>Santa Marina</option>
            <option>DIVERSOS</option>
          </select>

          <input
            style={input}
            placeholder="Peso kg/m"
            value={form.peso_kg_m}
            onChange={(e) => setForm({ ...form, peso_kg_m: e.target.value })}
          />

          <input
            style={input}
            placeholder="Barra padrão Ex: 6000"
            value={form.barra}
            onChange={(e) => setForm({ ...form, barra: e.target.value })}
          />

          <select
            style={input}
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option>Marco</option>
            <option>Folha</option>
            <option>Trilho</option>
            <option>Travessa</option>
            <option>Arremate</option>
            <option>Coluna</option>
            <option>Outro</option>
          </select>

          <input
            style={input}
            placeholder="Valor kg alumínio"
            value={form.valor_kg}
            onChange={(e) => setForm({ ...form, valor_kg: e.target.value })}
          />

          <input
            style={input}
            placeholder="URL da imagem"
            value={form.imagem}
            onChange={(e) => setForm({ ...form, imagem: e.target.value })}
          />

          <button style={btnSalvar} onClick={salvar}>
            Salvar Perfil
          </button>
        </div>

        <div style={cardLista}>
          <h2>Perfis Cadastrados</h2>

          <table style={tabela}>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Código</th>
                <th>Nome</th>
                <th>Linha</th>
                <th>Peso kg/m</th>
                <th>Barra</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imagem ? (
                      <img src={p.imagem} alt="" width="45" />
                    ) : (
                      <div style={miniImg}>IMG</div>
                    )}
                  </td>
                  <td>{p.codigo}</td>
                  <td>{p.descricao || p.nome}</td>
                  <td>{p.linha}</td>
                  <td>{Number(p.peso_kg_m || 0).toFixed(3)}</td>
                  <td>{p.barra || 6000}</td>
                  <td>R$ {Number(p.valor_unitario || 0).toFixed(2)}</td>
                  <td>...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const pagina = {
  padding: 25,
  background: "#e9f1ef",
  minHeight: "100vh",
};

const topo = {
  display: "grid",
  gridTemplateColumns: "1fr 150px 130px",
  gap: 12,
  marginBottom: 20,
};

const buscaInput = {
  padding: 15,
  borderRadius: 10,
  border: "1px solid #cbd5d1",
};

const btnAzul = {
  background: "#1d4ed8",
  color: "white",
  border: 0,
  borderRadius: 10,
  fontWeight: "bold",
};

const btnPreto = {
  background: "#020617",
  color: "white",
  border: 0,
  borderRadius: 10,
  fontWeight: "bold",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "380px 1fr",
  gap: 25,
};

const card = {
  background: "white",
  borderRadius: 18,
  padding: 25,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const cardLista = {
  background: "white",
  borderRadius: 18,
  padding: 25,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const preview = {
  display: "flex",
  gap: 15,
  padding: 15,
  border: "1px dashed #b8c7c2",
  borderRadius: 14,
  marginBottom: 18,
};

const boxImg = {
  width: 85,
  height: 70,
  borderRadius: 12,
  background: "#dbe7e4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const input = {
  width: "100%",
  padding: 13,
  borderRadius: 10,
  border: "1px solid #d0d7de",
  marginBottom: 12,
};

const btnSalvar = {
  width: "100%",
  padding: 15,
  borderRadius: 12,
  border: 0,
  background: "#0f172a",
  color: "white",
  fontWeight: "bold",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
};

const miniImg = {
  width: 45,
  height: 35,
  background: "#dbe7e4",
  borderRadius: 6,
  fontSize: 11,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};