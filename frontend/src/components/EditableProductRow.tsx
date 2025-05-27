import { useState } from 'react';
import type { Product } from '../types';

type Props = {
  product: Product;
  onSave: (product: Product) => void;
};
export default function EditableProductRow({ product, onSave }: Props) {
  const [formData, setFormData] = useState<Product>({
    ...product,
    estoque_atual: product.estoque_atual ?? 0,
    retirada: 0,
    destino: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estoque_atual' || name === 'retirada' ? Number(value) : value
    }));
  };

  const aplicarRetirada = () => {
    if (!formData.retirada || !formData.destino) {
      alert("Informe a quantidade e o destino.");
      return;
    }

    if (formData.retirada > (formData.estoque_atual ?? 0)) {
      alert("Estoque insuficiente.");
      return;
    }

    const novoEstoque = (formData.estoque_atual ?? 0) - formData.retirada;

    alert(`Produto destinado ao ${formData.destino}`);

    setFormData(prev => ({
      ...prev,
      estoque_atual: novoEstoque,
      retirada: 0,
      destino: ''
    }));

    onSave({
      ...formData,
      estoque_atual: novoEstoque,
      retirada: 0,
      destino: ''
    });
  };

  return (
    <tr className="border-t">
      <td className="p-2">{formData.id}</td>
      <td className="p-2">{formData.nome}</td>
      <td className="p-2">
        <input
          type="number"
          name="estoque_atual"
          value={formData.estoque_atual}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2">
        <input
          type="number"
          name="retirada"
          value={formData.retirada ?? ''}
          onChange={handleChange}
          placeholder="Qtd a retirar"
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2">
        <select
          name="destino"
          value={formData.destino ?? ''}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="" disabled>Selecionar Andar</option>
          <option value="4º andar">4º andar</option>
          <option value="5º andar">5º andar</option>
        </select>
      </td>
      <td className="p-2 space-x-2">
        <button
          onClick={aplicarRetirada}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Aplicar
        </button>
        <button
          onClick={() => onSave(formData)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </td>
    </tr>
  );
}
