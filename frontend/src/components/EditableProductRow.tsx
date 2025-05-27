import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '../types';

type Props = {
  product: Product;
  onSave: (product: Product) => void;
};

export default function EditableProductRow({ product, onSave }: Props) {
  const [formData, setFormData] = useState<Product>({
    ...product,
    retirada: 0,
    destino: '',
  });

  const [retiradaInfo, setRetiradaInfo] = useState<{ quantidade: number; destino: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'retirada' ? Number(value) : value,
    }));
  };

  const aplicarRetirada = async () => {
    if (!formData.retirada || !formData.destino) {
      alert('Informe a quantidade e o destino.');
      return;
    }

    if (formData.retirada > (formData.estoque_atual ?? 0)) {
      alert('Estoque insuficiente.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/products/retirada', {
        id: product.id,
        quantidade: formData.retirada,
        andar: formData.destino,
      });

      // Atualiza o estoque localmente conforme o retorno ou simples fetch
      const updatedProduct = { ...formData };
      updatedProduct.estoque_atual = (updatedProduct.estoque_atual ?? 0) - formData.retirada;

      // Atualiza o estoque por andar
      if (formData.destino === '4º andar') {
        updatedProduct.estoque_4andar = (updatedProduct.estoque_4andar ?? 0) + formData.retirada;
      } else if (formData.destino === '5º andar') {
        updatedProduct.estoque_5andar = (updatedProduct.estoque_5andar ?? 0) + formData.retirada;
      }

      setFormData({
        ...updatedProduct,
        retirada: 0,
        destino: '',
      });

      setRetiradaInfo({ quantidade: formData.retirada, destino: formData.destino });

      onSave(updatedProduct);

    } catch (error) {
      alert('Erro ao registrar retirada.');
    }
  };

  return (
    <tr className="border-t">
      <td className="p-2">{formData.id}</td>
      <td className="p-2">{formData.nome}</td>
      <td className="p-2">{formData.estoque_atual}</td>
      <td className="p-2">{formData.estoque_4andar ?? 0}</td>
      <td className="p-2">{formData.estoque_5andar ?? 0}</td>
      <td className="p-2">
        <input
          type="number"
          name="retirada"
          value={formData.retirada ?? ''}
          onChange={handleChange}
          min={0}
          className="w-full border px-2 py-1 rounded"
          placeholder="Qtd a retirar"
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
      </td>
      <td className="p-2 text-green-700 font-semibold">
        {retiradaInfo && (
          <div>
            Retirado: {retiradaInfo.quantidade} para {retiradaInfo.destino}
          </div>
        )}
      </td>
    </tr>
  );
}
