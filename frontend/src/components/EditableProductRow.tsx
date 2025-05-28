import { useState } from 'react';
import axios from 'axios';
import { Product } from '../types';

type Props = {
  product: Product;
  estoque_4andar: number;
  estoque_5andar: number;
  onSave: () => void;
};

export default function EditableProductRow({ product, estoque_4andar, estoque_5andar, onSave }: Props) {
  const [quantidade, setQuantidade] = useState<number>(0);
  const [destino, setDestino] = useState<'4º andar' | '5º andar'>('4º andar');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (quantidade <= 0) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/retirada', {
        id: product.id,
        quantidade,
        destino,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setQuantidade(0);
      onSave(); // recarrega a lista
    } catch (error) {
      console.error('Erro ao registrar retirada:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="border px-4 py-2 text-center">{product.id}</td>
      <td className="border px-4 py-2">{product.nome}</td>
      <td className="border px-4 py-2 text-center">{product.estoque_atual}</td>
      <td className="border px-4 py-2 text-center">{estoque_4andar}</td>
      <td className="border px-4 py-2 text-center">{estoque_5andar}</td>
      <td className="border px-4 py-2 text-center">
        <input
          type="number"
          min="0"
          className="border rounded w-20 text-center"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
        />
      </td>
      <td className="border px-4 py-2 text-center">
        <select
          className="border rounded px-2 py-1"
          value={destino}
          onChange={(e) => setDestino(e.target.value as '4º andar' | '5º andar')}
        >
          <option value="4º andar">4º andar</option>
          <option value="5º andar">5º andar</option>
        </select>
      </td>
      <td className="border px-4 py-2 text-center">
        <button
          onClick={handleSubmit}
          disabled={loading || quantidade <= 0}
          className={`px-3 py-1 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Salvando...' : 'Retirar'}
        </button>
      </td>
      <td className="border px-4 py-2 text-center">
        {success && <span className="text-green-600 font-medium">✔️</span>}
      </td>
    </tr>
  );
}
