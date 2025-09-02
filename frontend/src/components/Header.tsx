import '../styles/Header.css';
import { exportMovimentacoesExcel } from '../utils/exportExcel'; // ajuste o caminho
import { FaFileExcel } from 'react-icons/fa';

export default function Header() {
  const handleExportAll = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movimentacoes`);
      if (!res.ok) throw new Error("Erro ao carregar movimentações");
      const data = await res.json();
      await exportMovimentacoesExcel(data, "Todas_Movimentacoes.xlsx");
    } catch (err: any) {
      alert("Erro ao exportar: " + err.message);
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

        {/* Botão de exportação de todas movimentações */}
        <button
          onClick={handleExportAll}
          style={{
            marginLeft: "auto",
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
    </header>
  );
}
