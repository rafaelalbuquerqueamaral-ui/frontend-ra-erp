export default function DesenhoTecnico({ largura = 1000, altura = 1000, tipo = "janela" }) {
  const w = 200;
  const h = (altura / largura) * 200;

  return (
    <svg width={w + 80} height={h + 80}>
      
      {/* moldura */}
      <rect x="40" y="20" width={w} height={h} fill="none" stroke="black" strokeWidth="2" />

      {/* tipo */}
      {tipo === "janela" && (
        <>
          <line x1="40" y1="20" x2={40 + w} y2={20 + h} stroke="gray" />
          <line x1={40 + w} y1="20" x2="40" y2={20 + h} stroke="gray" />
        </>
      )}

      {tipo === "porta" && (
        <>
          <line x1="40" y1="20" x2="40" y2={20 + h} stroke="black" />
          <line x1={40 + w} y1="20" x2={40 + w} y2={20 + h} stroke="black" />
        </>
      )}

      {/* cota largura */}
      <line x1="40" y1={h + 30} x2={40 + w} y2={h + 30} stroke="black" />
      <text x={40 + w / 2} y={h + 45} fontSize="10" textAnchor="middle">
        {largura} mm
      </text>

      {/* cota altura */}
      <line x1="10" y1="20" x2="10" y2={20 + h} stroke="black" />
      <text x="5" y={20 + h / 2} fontSize="10" transform={`rotate(-90 5 ${20 + h / 2})`}>
        {altura} mm
      </text>
    </svg>
  );
}