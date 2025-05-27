import { Product } from '../types';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  product: Product;
  onSave: () => void;
};

export default function EditableProductRow({ product, onSave }: Props) {
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual ?? 0);
  const [andar4, setAndar4] = useState(product.estoque_4andar ?? 0);
  const [andar5, setAndar5] = useState(product.estoque_5andar ?? 0);

  const handleRetirada = async (quantidade: number, andar: string) => {
    try {
      await axios.post('http://localhost:8000/products/retirada', {
        id: product.id,
        quantidade,
        andar
      });
      onSave(); // Atualiza produtos no componente pai
    } catch (error: any) {
      alert('Erro ao registrar retirada: ' + error.response?.data?.detail || error.message);
    }
  };

  return (
    <tr>
      <td className="border px-2 py-1">{product.id}</td>
      <td className="border px-2 py-1">{product.nome}</td>
      <td className="border px-2 py-1">
        <input
          type="number"
          value={estoqueAtual}
          onChange={e => setEstoqueAtual(Number(e.target.value))}
          className="w-20 border px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          type="number"
          value={andar4}
          onChange={e => setAndar4(Number(e.target.value))}
          className="w-20 border px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          type="number"
          value={andar5}
          onChange={e => setAndar5(Number(e.target.value))}
          className="w-20 border px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <button
          className="bg-blue-500 text-white px-2 py-1 mr-1"
          onClick={() => handleRetirada(1, '4')}
        >+ 4º</button>
        <button
          className="bg-green-500 text-white px-2 py-1"
          onClick={() => handleRetirada(1, '5')}
        >+ 5º</button>
      </td>
    </tr>
  );
}
