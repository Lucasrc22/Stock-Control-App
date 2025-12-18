import { useEffect, useState } from 'react';
import { setorService, Setor } from '../services/setorService';
import EditableSetorRow from './EditableSetorRow';
import SetorHistoricoList from './SetorHistoricoList';
import '../styles/SetorList.css';

export default function SetorList() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSetores() {
    try {
      const data = await setorService.getAll();
      setSetores(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSetores();
  }, []);

  function handleSetorChange(updated: Setor) {
    setSetores(prev =>
      prev.map(s => (s.id === updated.id ? updated : s))
    );
  }

  if (loading) {
    return <p className="text-center py-10">Carregando setores...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="setor-container">
      {/* 🔹 LISTA DE SETORES */}
      <div className="setor-scroll">
        <table className="setor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Total</th>
              <th>Financeiro</th>
              <th>Fiscal</th>
              <th>TI</th>
              <th>Comercial</th>
              <th>RH</th>
              <th>DP</th>
              <th>Suprimentos</th>
              <th>Jurídico</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {setores.map(setor => (
              <EditableSetorRow
                key={setor.id}
                setor={setor}
                onChange={handleSetorChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="historico-container">
        <SetorHistoricoList />
      </div>

    </div>
  );
}
