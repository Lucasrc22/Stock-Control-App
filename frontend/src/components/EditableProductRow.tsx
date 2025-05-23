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

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantidade_retirada' || name === 'estoque_atual'
        ? Number(value)
        : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
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
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </td>
    </tr>
  );
}
