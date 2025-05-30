import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';

interface Props {
  product: Product;
  onChange: (updatedProduct: Product) => void;
}

export default function EditableProductRow({ product, onChange }: Props) {
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual);
  const [estoque4Andar, setEstoque4Andar] = useState(product.estoque_4andar ?? 0);
  const [estoque5Andar, setEstoque5Andar] = useState(product.estoque_5andar ?? 0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEstoqueAtual(product.estoque_atual);
    setEstoque4Andar(product.estoque_4andar ?? 0);
    setEstoque5Andar(product.estoque_5andar ?? 0);
  }, [product]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedProduct: Product = {
        ...product,
        estoque_atual: estoqueAtual,
        estoque_4andar: estoque4Andar,
        estoque_5andar: estoque5Andar,
      };
      onChange(updatedProduct);
      saveProduct(updatedProduct);
    }, 800);

    return () => clearTimeout(timer);
  }, [estoqueAtual, estoque4Andar, estoque5Andar]);

  async function saveProduct(updatedProduct: Product) {
    try {
      setSaving(true);
      await axios.put(`http://localhost:8000/products/${updatedProduct.id}`, updatedProduct);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="transition hover:bg-blue-50">
      <td className="border px-3 py-2 text-center text-gray-800">{product.id}</td>
      <td className="border px-3 py-2 text-gray-900">{product.nome}</td>

      <td className="border px-3 py-2 text-center">
        <input
          type="number"
          min={0}
          value={estoqueAtual}
          onChange={e => setEstoqueAtual(Number(e.target.value))}
          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </td>

      <td className="border px-3 py-2 text-center">
        <input
          type="number"
          min={0}
          value={estoque4Andar}
          onChange={e => setEstoque4Andar(Number(e.target.value))}
          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </td>

      <td className="border px-3 py-2 text-center">
        <input
          type="number"
          min={0}
          value={estoque5Andar}
          onChange={e => setEstoque5Andar(Number(e.target.value))}
          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </td>

      <td className="border px-3 py-2 text-center">
        {saving ? (
          <span className="text-sm text-gray-400 animate-pulse">Salvando...</span>
        ) : (
          <span className="text-sm text-green-600">✔ Salvo</span>
        )}
      </td>
    </tr>
  );
}
