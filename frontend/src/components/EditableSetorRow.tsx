import { useEffect, useState } from 'react';
import { Setor, setorService } from '../services/api';
import '../styles/EditableProductRow.css';

interface Props {
  setor: Setor;
  onChange: (updatedSetor: Setor) => void;
}

/**
 * Campos numéricos que representam estoques por setor
 */
type CampoSetor =
  | 'financeiro'
  | 'fiscal'
  | 'ti'
  | 'comercial'
  | 'rh'
  | 'dp'
  | 'suprimentos'
  | 'juridico';

/**
 * Campos realmente editáveis na tela
 * (nunca incluir id ou item aqui)
 */
type CampoEditavel = 'total' | CampoSetor;

/**
 * Lista exata de inputs exibidos no modo edição
 */
const CAMPOS_EDITAVEIS: CampoEditavel[] = [
  'total',
  'financeiro',
  'fiscal',
  'ti',
  'comercial',
  'rh',
  'dp',
  'suprimentos',
  'juridico'
];

export default function EditableSetorRow({ setor, onChange }: Props) {
  const [localSetor, setLocalSetor] = useState<Setor>({ ...setor });
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Sempre que o setor mudar externamente,
   * sincroniza o estado local
   */
  useEffect(() => {
    setLocalSetor({ ...setor });
    setShowEdit(false);
  }, [setor]);

  /**
   * Atualiza campos editáveis
   * - Se for total → altera direto
   * - Se for setor → ajusta o total automaticamente
   */
  function handleChange(field: CampoEditavel, value: number) {
    setLocalSetor(prev => {
      if (field === 'total') {
        return { ...prev, total: value };
      }

      const delta = prev[field] - value;

      return {
        ...prev,
        [field]: value,
        total: delta < 0 ? prev.total + delta : prev.total
      };
    });
  }


  /**
   * Envia atualização para o backend
   */
  /**
   * Ajusta o valor atual em +1 / -1 (min 0) e delega para handleChange
   */
  function changeBy(field: CampoEditavel, delta: number) {
    setLocalSetor(prev => {
      const current = (prev as any)[field] ?? 0;
      const next = Math.max(0, Number(current) + delta);

      // Se for 'total', apenas atualiza total; caso contrário ajusta setor e total
      if (field === 'total') {
        return { ...prev, total: next } as Setor;
      }

      const d = (prev as any)[field] - next;

      return {
        ...prev,
        [field]: next,
        total: d < 0 ? prev.total + d : prev.total
      } as Setor;
    });
  }

  async function handleUpdateSetor() {
    setLoading(true);
    try {
      const updated = await setorService.updateSetor(setor.id, {
        item: localSetor.item,
        total: localSetor.total,
        financeiro: localSetor.financeiro,
        fiscal: localSetor.fiscal,
        ti: localSetor.ti,
        comercial: localSetor.comercial,
        rh: localSetor.rh,
        dp: localSetor.dp,
        suprimentos: localSetor.suprimentos,
        juridico: localSetor.juridico
      });

      onChange(updated);
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar setor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr className="transition hover:bg-blue-50 border-b-2 border-gray-200 text-center">
      <td className="py-2 px-4">{setor.id}</td>
      <td className="py-2 px-4 font-medium">{setor.item}</td>

      <td className="py-2 px-4">{localSetor.total}</td>
      <td className="py-2 px-4">{localSetor.financeiro}</td>
      <td className="py-2 px-4">{localSetor.fiscal}</td>
      <td className="py-2 px-4">{localSetor.ti}</td>
      <td className="py-2 px-4">{localSetor.comercial}</td>
      <td className="py-2 px-4">{localSetor.rh}</td>
      <td className="py-2 px-4">{localSetor.dp}</td>
      <td className="py-2 px-4">{localSetor.suprimentos}</td>
      <td className="py-2 px-4">{localSetor.juridico}</td>

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
              {CAMPOS_EDITAVEIS.map(field => (
                <div key={field} className="input-stepper">
                  <button
                    type="button"
                    onClick={() => changeBy(field, -1)}
                    className="step-btn"
                    aria-label={`Diminuir ${field}`}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={0}
                    value={localSetor[field] as any}
                    onChange={e => handleChange(field, Number(e.target.value))}
                    className="input-quantidade"
                    placeholder={field}
                  />

                  <button
                    type="button"
                    onClick={() => changeBy(field, 1)}
                    className="step-btn"
                    aria-label={`Aumentar ${field}`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleUpdateSetor}
                disabled={loading}
                className="button-action bg-green-600 text-white"
              >
                Confirmar
              </button>

              <button
                onClick={() => {
                  setLocalSetor({ ...setor });
                  setShowEdit(false);
                }}
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
