import '../styles/Header.css';
import { exportMovimentacoesCSV } from '../utils/exportCSV';
import { FaFileExcel } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExportAll = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movimentacoes`);
      if (!res.ok) throw new Error("Erro ao carregar movimentações");
      const data = await res.json();
      await exportMovimentacoesCSV(data, "Todas_Movimentacoes.csv");
    } catch (err: any) {
      alert("Erro ao exportar: " + err.message);
    }
  };

  const handleNavigation = () => {
    if (location.pathname === "/setores") {
      navigate("/"); // se estiver em /setores, volta para /
    } else {
      navigate("/setores"); // senão, vai para /setores
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/assets/Simbolo_Galactus_colorido_fundo_branco.jpg"
          alt="Logo"
          className="logo"
        />
        <h1 className="title">Stock Control</h1>

        {/* Botões do header */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
          {/* Alterna entre Setores e Voltar */}
          <button
            onClick={handleNavigation}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: location.pathname === "/setores" ? "#6c757d" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
            }}
          >
            {location.pathname === "/setores" ? "Voltar" : "Setores"}
          </button>

          {/* Exportar movimentações */}
          <button
            onClick={handleExportAll}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaFileExcel />
            Exportar todas
          </button>
        </div>
      </div>
    </header>
  );
}
