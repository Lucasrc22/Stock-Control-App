import '../styles/Header.css';
import { exportMovimentacoesExcel } from "../utils/exportExcel";

export default function Header() {
  const handleExportAll = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movimentacoes`);
      if (!res.ok) throw new Error("Erro ao carregar todas movimentações");
      const data = await res.json();
      exportMovimentacoesExcel(data, "Todas_Movimentacoes.xlsx");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <header className="header">
      <div className="header-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/assets/Simbolo_Galactus_colorido_fundo_branco.jpg" alt="Logo" className="logo" />
          <h1 className="title">Stock Control</h1>
        </div>
        <button
          onClick={handleExportAll}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#107c10",
            color: "white",
            border: "none",
            borderRadius: "0.3rem",
            cursor: "pointer"
          }}
        >
          Exportar todas movimentações
        </button>
      </div>
    </header>
  );
}
