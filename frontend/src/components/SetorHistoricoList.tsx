import { useEffect, useState } from 'react';
import axios from 'axios';

interface Historico {
  id_produto: number;
  tipo: string;
  quantidade: number;
  setor: string;
  timestamp: string;
}

export default function SetorHistoricoList() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistorico() {
    try {
      const res = await axios.get('http://192.168.0.32:8000/setores/historico');
      setHistorico(res.data);
    } catch (err) {
      console.error('Erro ao carregar histórico', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistorico();
  }, []);

  if (loading) {
    return <p className="mt-6 text-center">Carregando histórico...</p>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">
        Histórico de Movimentações
      </h2>

      <table className="setor-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Setor</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {historico.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Nenhuma movimentação registrada
              </td>
            </tr>
          )}

          {historico.map((h, index) => (
            <tr key={index}>
              <td>{h.id_produto}</td>
              <td>{String(h.tipo || '').toUpperCase()}</td>
              <td>{h.quantidade}</td>
              <td>{h.setor}</td>
              <td>
                {h.timestamp
                  ? new Date(h.timestamp).toLocaleString('pt-BR')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
