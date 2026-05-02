import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const menu = [
    { nome: "Painel", path: "/" },
    { nome: "Clientes", path: "/clientes" },
    { nome: "Linhas", path: "/linhas" },
    { nome: "Perfis", path: "/perfis" },
    { nome: "Vidros", path: "/vidros" },
    { nome: "Acessórios", path: "/acessorios" },
    { nome: "Cores", path: "/cores" },
    { nome: "Tipologias", path: "/tipologias" },
    { nome: "Orçamentos", path: "/orcamentos" },
    { nome: "Fachada CAD", path: "/fachada-cad" },
    { nome: "Fachadas", path: "/fachadas" },
    { nome: "Lista de Corte", path: "/lista-corte" },
    { nome: "Produção", path: "/producao" },
    { nome: "Importar Biblioteca", path: "/importar-biblioteca" },
  ];

  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div style={logoBox}>
          <div style={logo}>R&A</div>
          <div>
            <h2 style={logoTitle}>Sistema</h2>
            <span style={logoSub}>ERP Industrial</span>
          </div>
        </div>

        <nav>
          {menu.map((item) => {
            const ativo = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...link,
                  background: ativo ? "#2563eb" : "transparent",
                  color: ativo ? "#fff" : "#cbd5e1",
                }}
              >
                {item.nome}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={main}>
        <div style={topbar}>
          <div>
            <strong>R&A Vidros e Esquadrias</strong>
            <p style={{ margin: 0, color: "#64748b" }}>
              Gestão técnica, orçamento e produção
            </p>
          </div>

          <div style={badge}>Online</div>
        </div>

        <div style={content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const layout = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "Inter, Arial, sans-serif",
  background: "#eef2f7",
};

const sidebar = {
  width: 260,
  background: "linear-gradient(180deg,#020617,#0f172a)",
  color: "#fff",
  padding: 22,
};

const logoBox = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 30,
};

const logo = {
  width: 48,
  height: 48,
  borderRadius: 14,
  background: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const logoTitle = {
  margin: 0,
  fontSize: 20,
};

const logoSub = {
  fontSize: 12,
  color: "#94a3b8",
};

const link = {
  display: "block",
  padding: "13px 15px",
  borderRadius: 10,
  textDecoration: "none",
  marginBottom: 7,
  fontWeight: 600,
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const topbar = {
  height: 74,
  background: "#fff",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 28px",
};

const badge = {
  background: "#dcfce7",
  color: "#166534",
  padding: "8px 14px",
  borderRadius: 999,
  fontWeight: "bold",
};

const content = {
  padding: 28,
};