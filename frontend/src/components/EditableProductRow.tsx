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
      setSaving(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setSaving(false);
    }
  }

  return (
    <tr>
      <td className="border px-2 py-1">{product.id}</td>
      <td className="border px-2 py-1">{product.nome}</td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoqueAtual}
          onChange={e => setEstoqueAtual(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoque4Andar}
          onChange={e => setEstoque4Andar(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoque5Andar}
          onChange={e => setEstoque5Andar(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1">
        {saving ? (
          <span className="text-sm text-gray-500">Salvando...</span>
        ) : (
          <span className="text-sm text-green-500">Salvo</span>
        )}
      </td>
    </tr>
  );
}
