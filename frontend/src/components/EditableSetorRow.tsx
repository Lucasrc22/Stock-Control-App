import { useState, useEffect } from 'react';
import { Setor } from '../types'; // defina o tipo Setor igual ao backend
import { setorService } from '../services/api'; // criar funções de API para atualizar setor
import '../styles/EditableProductRow.css';

interface Props {
  setor: Setor;
  onChange: (updatedSetor: Setor) => void;
}

export default function EditableSetorRow({ setor, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [localSetor, setLocalSetor] = useState<Setor>({ ...setor });

  useEffect(() => {
    setLocalSetor({ ...setor });
    setShowEdit(false);
  }, [setor]);

  async function handleUpdateSetor() {
    setLoading(true);
    try {
      const updated = await setorService.updateSetor(localSetor.id, localSetor);
      onChange(updated);
      setShowEdit(false);
    } catch (err) {
      alert('Erro ao atualizar setor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Setor, value: number) {
    setLocalSetor(prev => ({ ...prev, [field]: value }));
  }

  return (
    <tr className="transition hover:bg-blue-50 border-b-2 border-gray-200 text-center">
      <td className="py-2 px-4">{setor.id}</td>
      <td className="py-2 px-4 font-medium">{setor.item}</td>
      <td className="py-2 px-4">{setor.total}</td>
      <td className="py-2 px-4">{setor.financeiro}</td>
      <td className="py-2 px-4">{setor.fiscal}</td>
      <td className="py-2 px-4">{setor.ti}</td>
      <td className="py-2 px-4">{setor.comercial}</td>
      <td className="py-2 px-4">{setor.rh}</td>
      <td className="py-2 px-4">{setor.dp}</td>
      <td className="py-2 px-4">{setor.suprimentos}</td>
      <td className="py-2 px-4">{setor.juridico}</td>
      <td className="py-2 px-4 space-y-2">
        {!showEdit && (
          <button
            onClick={() => setShowEdit(true)}
            className="button-action bg-blue-600 text-white"
          >
            Editar
          </button>
        )}
        {showEdit && (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {(['financeiro','fiscal','ti','comercial','rh','dp','suprimentos','juridico'] as (keyof Setor)[]).map(field => (
                <input
                  key={field}
                  type="number"
                  min={0}
                  value={localSetor[field]}
                  onChange={e => handleChange(field, Number(e.target.value))}
                  className="input-quantidade"
                  placeholder={field}
                />
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleUpdateSetor}
                disabled={loading}
                className="button-action bg-green-600 text-white"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="button-action bg-red-600 text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
