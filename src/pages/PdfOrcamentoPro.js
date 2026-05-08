import React from "react";

export default function PdfOrcamentoPro() {
  const itens = [
    {
      item: "J1",
      titulo: "JANELA DE CORRER 2 FOLHAS MÓVEIS - LINHA SUPREMA",
      largura: 1570,
      altura: 1180,
      cor: "PINTADO BRANCO",
      vidro: "6MM INCOLOR TEMPERADO",
      qtd: 1,
      valor: "1.895,00",
    },
    {
      item: "J2",
      titulo: "JANELA DE CORRER 2 FOLHAS MÓVEIS - LINHA SUPREMA",
      largura: 1370,
      altura: 1180,
      cor: "PINTADO BRANCO",
      vidro: "6MM INCOLOR TEMPERADO",
      qtd: 1,
      valor: "1.740,00",
    },
    {
      item: "J3",
      titulo: "JANELA MAXIM - AR 1 MÓDULO - LINHA SUPREMA",
      largura: 580,
      altura: 810,
      cor: "PINTADO BRANCO",
      vidro: "3MM MINI BOREAL",
      qtd: 1,
      valor: "632,00",
    },
  ];

  return (
    <div style={pagina}>
      <button className="no-print" onClick={() => window.print()} style={botao}>
        Imprimir / Salvar PDF
      </button>

      <div style={folha}>
        <div style={cabecalho}>
          <div style={logoBox}>
            <div style={logoTexto}>R&A VIDROS</div>
            <div style={logoDesenho}>▯ ▯ ▯</div>
          </div>

          <div style={empresa}>
            <h2>R&A Vidros e Esquadrias de Alumínio</h2>
            <p>RUA ISMAEL JOÃO DA SILVA 654 - FLORIANÓPOLIS - SC</p>
            <p>RAFAELALBUQUERQUE.AMARAL@GMAIL.COM</p>
            <p>(48)99687-8136</p>
          </div>
        </div>

        <div style={linhaInfo}>
          <b>ORÇAMENTO:</b> PROP-9087
          <span style={{ float: "right" }}>
            <b>Data de Emissão:</b> 03/05/2026
          </span>
        </div>

        <div style={clienteBox}>
          <p><b>Cliente:</b> PAULO</p>
          <p><b>Telefone:</b></p>
          <p><b>Email:</b></p>
          <p><b>Endereço:</b> - -</p>
        </div>

        <div style={barra}>Composição do Orçamento</div>

        {itens.map((i, index) => (
          <div key={index} style={itemBox}>
            <h3>• {i.titulo}</h3>

            <div style={itemGrid}>
              <div style={desenho}>
                <div style={folhaDesenho}>→</div>
                <div style={folhaDesenho}>←</div>
              </div>

              <div style={dados}>
                <p><b>Item:</b> {i.item}</p>
                <p><b>Ambiente:</b></p>
                <br />
                <p><b>Largura x Altura:</b> {i.largura} x {i.altura}</p>
                <br />
                <p><b>Valor Unitário:</b> R$ {i.valor}</p>
              </div>

              <div style={dados}>
                <p><b>Trat./Cor:</b> {i.cor}</p>
                <p><b>Vidro/Chapa:</b> {i.vidro}</p>
                <br />
                <p><b>Qtde:</b> {i.qtd}</p>
                <br />
                <p><b>Valor Total:</b> R$ {i.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }

            body {
              margin: 0;
              background: white;
            }

            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `}
      </style>
    </div>
  );
}

const pagina = {
  background: "#444",
  minHeight: "100vh",
  padding: 20,
};

const folha = {
  width: "794px",
  minHeight: "1123px",
  background: "white",
  margin: "0 auto",
  padding: 18,
  fontFamily: "Arial",
  fontSize: 12,
  color: "#111",
};

const botao = {
  marginBottom: 15,
  padding: "10px 18px",
  background: "#111827",
  color: "white",
  border: "none",
};

const cabecalho = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  border: "1px solid #222",
};

const logoBox = {
  borderRight: "1px solid #222",
  padding: 10,
  textAlign: "center",
  background: "#d9e5c8",
};

const logoTexto = {
  fontWeight: "bold",
  marginBottom: 10,
};

const logoDesenho = {
  fontSize: 45,
};

const empresa = {
  textAlign: "center",
  padding: 10,
};

const linhaInfo = {
  borderLeft: "1px solid #222",
  borderRight: "1px solid #222",
  borderBottom: "1px solid #222",
  padding: 6,
};

const clienteBox = {
  padding: "10px 0",
  lineHeight: 1.1,
};

const barra = {
  background: "#d9e5c8",
  border: "1px solid #999",
  padding: 4,
  fontWeight: "bold",
};

const itemBox = {
  borderBottom: "2px solid #222",
  padding: "6px 0",
};

const itemGrid = {
  display: "grid",
  gridTemplateColumns: "130px 1fr 1fr",
  border: "1px solid #aaa",
};

const desenho = {
  height: 115,
  display: "flex",
  padding: 8,
  borderRight: "1px solid #aaa",
};

const folhaDesenho = {
  flex: 1,
  border: "2px solid #222",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 22,
};

const dados = {
  padding: 8,
  borderRight: "1px solid #aaa",
};