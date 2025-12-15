import { useEffect, useState } from 'react';
import { setorService, Setor } from '../services/api';
import EditableSetorRow from './EditableSetorRow';
import '../styles/SetorList.css'; // reaproveitando estilo

export default function SetorList() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSetores = async () => {
    try {
      const data = await setorService.getAll();
      setSetores(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar setores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetores();
  }, []);

  function handleSetorChange(updatedSetor: Setor) {
    setSetores((prev) =>
      prev.map((s) => (s.id === updatedSetor.id ? updatedSetor : s))
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center shadow-md" role="alert">
        <strong className="font-semibold">Erro:</strong> <span>{error}</span>
      </div>
    );
  }


  return (
    <div className="setor-container">
      <div className="setor-scroll">
        <table className="setor-table">
          <thead className="bg-[#E6F1FA] text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Item</th>
              <th className="py-3 px-4 border">Total</th>
              <th className="py-3 px-4 border">Financeiro</th>
              <th className="py-3 px-4 border">Fiscal</th>
              <th className="py-3 px-4 border">TI</th>
              <th className="py-3 px-4 border">Comercial</th>
              <th className="py-3 px-4 border">RH</th>
              <th className="py-3 px-4 border">DP</th>
              <th className="py-3 px-4 border">Suprimentos</th>
              <th className="py-3 px-4 border">Jurídico</th>
              <th className="py-3 px-4 border">Ações</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {setores.map((setor) => (
              <EditableSetorRow
                key={setor.id}
                setor={setor}
                onChange={handleSetorChange}
              />
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
