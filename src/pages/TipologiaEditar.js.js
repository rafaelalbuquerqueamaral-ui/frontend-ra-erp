import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TipologiaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [linha, setLinha] = useState("");
  const [larguraPadrao, setLarguraPadrao] = useState("");
  const [alturaPadrao, setAlturaPadrao] = useState("");
  const [permiteEditarMedidas, setPermiteEditarMedidas] = useState(true);
  const [observacaoTecnica, setObservacaoTecnica] = useState("");
  const [imagem, setImagem] = useState("");
  const [imagemPdf, setImagemPdf] = useState("");
  const [arquivoImagem, setArquivoImagem] = useState(null);

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:3001/tipologias/${id}`);
      const data = await res.json();

      setNome(data.nome || "");
      setLinha(data.linha || "");
      setLarguraPadrao(data.larguraPadrao || "");
      setAlturaPadrao(data.alturaPadrao || "");
      setPermiteEditarMedidas(Boolean(data.permiteEditarMedidas));
      setObservacaoTecnica(data.observacaoTecnica || "");
      setImagem(data.imagem || "");
      setImagemPdf(data.imagemPdf || "");
    }

    carregar();
  }, [id]);

  async function enviarImagem() {
    if (!arquivoImagem) {
      return { url: imagem, arquivo: imagemPdf };
    }

    const formData = new FormData();
    formData.append("imagem", arquivoImagem);

    const res = await fetch("http://localhost:3001/upload-tipologia", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erro no upload");
    return await res.json();
  }

  async function salvar() {
    try {
      let imagemFinal = imagem;
      let imagemPdfFinal = imagemPdf;

      if (arquivoImagem) {
        const upload = await enviarImagem();
        imagemFinal = upload.url;
        imagemPdfFinal = upload.arquivo;
      }

      const res = await fetch(`http://localhost:3001/tipologias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          linha,
          larguraPadrao: Number(larguraPadrao || 0),
          alturaPadrao: Number(alturaPadrao || 0),
          permiteEditarMedidas,
          observacaoTecnica,
          imagem: imagemFinal,
          imagemPdf: imagemPdfFinal,
        }),
      });

      if (!res.ok) throw new Error("Erro ao editar");

      navigate("/tipologias");
    } catch (e) {
      console.error(e);
      alert("Erro ao editar tipologia");
    }
  }

  return (
    <div>
      <h1>Editar Tipologia</h1>

      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Linha" value={linha} onChange={(e) => setLinha(e.target.value)} style={{ marginLeft: "8px" }} />

      <br /><br />

      <input placeholder="Largura padrão" value={larguraPadrao} onChange={(e) => setLarguraPadrao(e.target.value)} />
      <input placeholder="Altura padrão" value={alturaPadrao} onChange={(e) => setAlturaPadrao(e.target.value)} style={{ marginLeft: "8px" }} />

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={permiteEditarMedidas}
          onChange={(e) => setPermiteEditarMedidas(e.target.checked)}
        />
        Permite editar medidas
      </label>

      <br /><br />

      <textarea
        placeholder="Observação técnica"
        value={observacaoTecnica}
        onChange={(e) => setObservacaoTecnica(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <br /><br />

      {imagem ? <img src={imagem} alt={nome} width="180" /> : null}

      <br /><br />

      <input type="file" accept="image/*" onChange={(e) => setArquivoImagem(e.target.files[0])} />

      <br /><br />

      <button onClick={salvar}>Salvar Alterações</button>
    </div>
  );
}