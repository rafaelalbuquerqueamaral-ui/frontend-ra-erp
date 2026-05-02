import DesenhoTecnico from "../components/DesenhoTecnico";

function tipoDesenho(item) {
  const texto = String(item.material || item.materialNome || "").toLowerCase();

  if (texto.includes("porta")) return "porta";
  if (texto.includes("maxim")) return "maxim_ar";
  return "janela";
}

export default function OrcamentoPrint({ orcamento }) {
  if (!orcamento) return null;

  return (
    <div
      id="pdf-area"
      style={{
        width: "800px",
        padding: "20px",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
      }}
    >
      <div style={{ border: "1px solid #000", padding: "10px" }}>
        {/* CABEÇALHO */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #000",
            paddingBottom: "10px",
          }}
        >
          <div style={{ width: "170px" }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "150px",
                height: "90px",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ margin: 0 }}>
              R&A Vidros e Esquadrias de Alumínio
            </h2>
            <div>RUA ISMAEL JOÃO DA SILVA 654 - FLORIANÓPOLIS - SC</div>
            <div>RAFAEL.AMARAL@GMAIL.COM</div>
            <div>(48) 99687-8136</div>
          </div>
        </div>

        {/* DADOS DO ORÇAMENTO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #000",
            padding: "8px 0",
          }}
        >
          <strong>ORÇAMENTO: PROP-{orcamento.id}</strong>
          <strong>Data de Emissão: {new Date().toLocaleDateString()}</strong>
        </div>

        {/* CLIENTE / OBRA */}
        <div style={{ padding: "10px 0" }}>
          <div>
            <strong>Cliente:</strong> {orcamento.cliente || "-"}
          </div>

          <div>
            <strong>Obra:</strong> {orcamento.obraNome || "-"}
          </div>

          <div>
            <strong>Tipo:</strong> {orcamento.tipo || "-"}
          </div>

          <div>
            <strong>Largura:</strong> {orcamento.largura || "-"} mm
          </div>

          <div>
            <strong>Altura:</strong> {orcamento.altura || "-"} mm
          </div>
        </div>

        {/* FAIXA VERDE */}
        <div
          style={{
            background: "#d9ead3",
            padding: "6px",
            fontWeight: "bold",
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            textAlign: "center",
          }}
        >
          Composição do Orçamento
        </div>

        {/* ITENS */}
        {(orcamento.itens || []).length === 0 ? (
          <div style={{ padding: "15px" }}>
            Nenhum item encontrado neste orçamento.
          </div>
        ) : (
          (orcamento.itens || []).map((item, i) => {
            const largura = orcamento.largura || 1000;
            const altura = orcamento.altura || 1000;

            return (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #000",
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  {i + 1}. {item.material || item.materialNome || "Item"}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 1fr",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  {/* DESENHO */}
                  <div>
                    <DesenhoTecnico
                      largura={largura}
                      altura={altura}
                      tipo={tipoDesenho(item)}
                    />
                  </div>

                  {/* DADOS TÉCNICOS */}
                  <div>
                    <p>
                      <strong>Categoria:</strong> {item.categoria || "-"}
                    </p>

                    <p>
                      <strong>Unidade:</strong> {item.unidade || "-"}
                    </p>

                    <p>
                      <strong>Quantidade:</strong>{" "}
                      {Number(item.quantidade || 0).toFixed(2)}
                    </p>

                    <p>
                      <strong>Comp. Peça:</strong>{" "}
                      {Number(item.comprimentoPeca || 0).toFixed(2)}
                    </p>

                    <p>
                      <strong>Repetições:</strong>{" "}
                      {Number(item.repeticoes || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* VALORES */}
                  <div>
                    <p>
                      <strong>Trat./Cor:</strong> PINTADO PRETO
                    </p>

                    <p>
                      <strong>Fórmula:</strong> {item.formula || "-"}
                    </p>

                    <p>
                      <strong>Valor Unitário:</strong> R${" "}
                      {Number(item.valorUnitario || 0).toFixed(2)}
                    </p>

                    <p>
                      <strong>Valor Total:</strong> R${" "}
                      {Number(item.subtotal || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* RESUMO */}
        {orcamento.detalhes ? (
          <div
            style={{
              marginTop: "15px",
              borderTop: "1px solid #000",
              paddingTop: "10px",
            }}
          >
            <h3>Resumo financeiro</h3>

            <div>
              Perfis: R$ {Number(orcamento.detalhes.custoPerfis || 0).toFixed(2)}
            </div>

            <div>
              Vidros: R$ {Number(orcamento.detalhes.custoVidros || 0).toFixed(2)}
            </div>

            <div>
              Acessórios: R${" "}
              {Number(orcamento.detalhes.custoAcessorios || 0).toFixed(2)}
            </div>

            <div>
              Mão de obra: R${" "}
              {Number(orcamento.detalhes.maoDeObra || 0).toFixed(2)}
            </div>

            <div>
              Lucro: R$ {Number(orcamento.detalhes.margemLucro || 0).toFixed(2)}
            </div>
          </div>
        ) : null}

        {/* TOTAL */}
        <div
          style={{
            textAlign: "right",
            paddingTop: "15px",
            marginTop: "10px",
            borderTop: "2px solid #000",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          TOTAL: R$ {Number(orcamento.valor || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
}