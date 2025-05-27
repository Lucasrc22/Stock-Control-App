import { Product } from '../types';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EditableProductRow({ product, onSave }: { product: Product, onSave: () => void }) {
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual ?? 0);
  const [andar4, setAndar4] = useState(product.estoque_4andar ?? 0);
  const [andar5, setAndar5] = useState(product.estoque_5andar ?? 0);

  const handleInputChange = (field: string, value: number) => {
    if (field === 'estoque_atual') setEstoqueAtual(value);
    if (field === 'estoque_4andar') setAndar4(value);
    if (field === 'estoque_5andar') setAndar5(value);
  };

  const handleRetirada = async (quantidade: number, andar: string) => {
    try {
      const response = await axios.post('http://localhost:8000/products/retirada', {
        id: product.id,
        quantidade,
        andar
      });

      const updatedProduct: Product = response.data;
      setEstoqueAtual(Number(updatedProduct.estoque_atual));
      setAndar4(Number(updatedProduct.estoque_4andar));
      setAndar5(Number(updatedProduct.estoque_5andar));
      onSave();
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
          onChange={(e) => handleInputChange('estoque_atual', parseInt(e.target.value))}
          className="w-20 border px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          type="number"
          value={andar4}
          onChange={(e) => handleInputChange('estoque_4andar', parseInt(e.target.value))}
          className="w-20 border px-1"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          type="number"
          value={andar5}
          onChange={(e) => handleInputChange('estoque_5andar', parseInt(e.target.value))}
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
      <td className="border px-2 py-1">Atualizado</td>
    </tr>
  );
}
