import { useState, useEffect } from "react";
import { FaExclamationCircle, FaFileExcel } from 'react-icons/fa';
import { exportMovimentacoesExcel } from '../utils/exportExcel'; // ajuste o caminho

interface Movimentacao {
  id_produto: number;
  tipo: string;
  quantidade: number;
  andar: string;
  timestamp: string;
}

interface Props {
  productId: number;
}

export default function MovimentacaoList({ productId }: Props) {
  const [movs, setMovs] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/movimentacoes`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar movimentações");
        return res.json();
      })
      .then((data) => {
        setMovs(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, productId]);

  const handleExportProduct = async () => {
    try {
      await exportMovimentacoesExcel(movs, `Movimentacoes_Produto_${productId}.xlsx`);
    } catch (err: any) {
      alert("Erro ao exportar: " + err.message);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Mostrar histórico"
        title="Mostrar histórico de movimentação"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaExclamationCircle
          size={28}
          color="orange"
          style={{ transition: "transform 0.2s ease" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "1rem",
            width: "300px",
            maxHeight: "200px",
            overflowY: "auto",
            top: "120%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {loading && <div>Carregando...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && movs.length === 0 && <div>Nenhuma movimentação</div>}

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {movs.map((mov, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <strong>{mov.tipo.toUpperCase()}</strong>: {mov.quantidade} unidade(s) - {mov.andar} <br />
                <small style={{ color: "#666" }}>
                  {new Date(mov.timestamp).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>

          {/* Botão para exportar movimentações deste produto */}
          {movs.length > 0 && (
            <button
              onClick={handleExportProduct}
              style={{
                marginTop: "0.5rem",
                padding: "0.3rem 0.5rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <FaFileExcel /> Exportar deste produto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
