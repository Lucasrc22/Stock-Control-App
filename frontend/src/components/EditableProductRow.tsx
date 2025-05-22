import { useState } from 'react';

type Product = {
  id: number;
  nome: string;
  estoque_atual?: number;
  data_entrada?: string;
  data_saida?: string;
  destinatario?: string;
  quantidade_retirada?: number;
};

type Props = {
  product: Product;
  onSave: (product: Product) => void;
};

export default function EditableProductRow({ product, onSave }: Props) {
  const [formData, setFormData] = useState<Product>(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantidade_retirada' || name === 'estoque_atual' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <tr>
      <td>{formData.id}</td>
      <td>{formData.nome}</td>
      <td>
        <input
          type="number"
          name="estoque_atual"
          value={formData.estoque_atual ?? ''}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="date"
          name="data_entrada"
          value={formData.data_entrada ?? ''}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="date"
          name="data_saida"
          value={formData.data_saida ?? ''}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="destinatario"
          value={formData.destinatario ?? ''}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="number"
          name="quantidade_retirada"
          value={formData.quantidade_retirada ?? ''}
          onChange={handleChange}
        />
      </td>
      <td>
        <button onClick={handleSave}>Salvar</button>
      </td>
    </tr>
  );
}
