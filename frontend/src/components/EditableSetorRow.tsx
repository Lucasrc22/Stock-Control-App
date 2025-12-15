import { useEffect, useState } from 'react';
import { Setor, setorService } from '../services/api';

interface Props {
  setor: Setor;
  onChange: (updated: Setor) => void;
}

export default function EditableSetorRow({ setor, onChange }: Props) {
  // Estado local espelhando o backend (NADA de cálculo)
  const [form, setForm] = useState<Setor>(setor);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Sempre que o setor mudar externamente, sincroniza
  useEffect(() => {
    setForm(setor);
  }, [setor]);

  function handleChange(
    field: keyof Setor,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const updated = await setorService.updateSetor(form.id, form);
      onChange(updated);
      setEditing(false);
    } catch (err) {
      alert('Erro ao atualizar setor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setForm(setor);
    setEditing(false);
  }

  return (
    <tr className="hover:bg-blue-50 border-b">
      <td className="border px-2">{setor.id}</td>
      <td className="border px-2">{setor.item}</td>

      {/* TOTAL (campo normal, independente) */}
      <td className="border px-2">
        <input
          type="number"
          value={form.total}
          disabled={!editing}
          onChange={(e) => handleChange('total', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.financeiro}
          disabled={!editing}
          onChange={(e) => handleChange('financeiro', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.fiscal}
          disabled={!editing}
          onChange={(e) => handleChange('fiscal', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.ti}
          disabled={!editing}
          onChange={(e) => handleChange('ti', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.comercial}
          disabled={!editing}
          onChange={(e) => handleChange('comercial', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.rh}
          disabled={!editing}
          onChange={(e) => handleChange('rh', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.dp}
          disabled={!editing}
          onChange={(e) => handleChange('dp', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.suprimentos}
          disabled={!editing}
          onChange={(e) => handleChange('suprimentos', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2">
        <input
          type="number"
          value={form.juridico}
          disabled={!editing}
          onChange={(e) => handleChange('juridico', e.target.value)}
          className="input-quantidade"
        />
      </td>

      <td className="border px-2 space-x-2">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="button-action bg-blue-600 text-white"
          >
            Editar
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="button-action bg-green-600 text-white"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="button-action bg-red-600 text-white"
            >
              Cancelar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
