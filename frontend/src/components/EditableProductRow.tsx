import { useState } from 'react';
import axios from 'axios';
import type { Product } from '../types';

type Props = {
  product: Product;
  estoque_4andar: number;
  estoque_5andar: number;
  onSave: (updatedProduct: Product) => void;
};

// Tipo explícito para o estado do formulário
type FormData = Product & {
  retirada: number;
  destino: string;
  estoque_4andar: number; // Garantindo que não será undefined
  estoque_5andar: number; // Garantindo que não será undefined
};

export default function EditableProductRow({ product, estoque_4andar, estoque_5andar, onSave }: Props) {
  // Estado inicial garantindo todos os valores numéricos
  const [formData, setFormData] = useState<FormData>({
    ...product,
    estoque_4andar: product.estoque_4andar ?? 0,
    estoque_5andar: product.estoque_5andar ?? 0,
    retirada: 0,
    destino: '',
  });

  const [retiradaInfo, setRetiradaInfo] = useState<{
    quantidade: number;
    destino: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'retirada' ? Math.max(0, Number(value)) : value,
    }));
  };

  const aplicarRetirada = async () => {
    if (!formData.retirada || !formData.destino) {
      alert('Informe a quantidade e o destino.');
      return;
    }

    if (formData.retirada > formData.estoque_atual) {
      alert('Estoque insuficiente.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/products/retirada', {
        id: formData.id,
        quantidade: formData.retirada,
        andar: formData.destino,
      });

      // Criando o produto atualizado com tipos explícitos
      const updatedProduct: FormData = {
        id: formData.id,
        nome: formData.nome,
        estoque_atual: formData.estoque_atual - formData.retirada,
        estoque_4andar: formData.destino === '4º andar' 
          ? formData.estoque_4andar + formData.retirada 
          : formData.estoque_4andar,
        estoque_5andar: formData.destino === '5º andar' 
          ? formData.estoque_5andar + formData.retirada 
          : formData.estoque_5andar,
        retirada: 0,
        destino: '',
      };

      setFormData(updatedProduct);
      setRetiradaInfo({
        quantidade: formData.retirada,
        destino: formData.destino,
      });

      onSave({
        id: updatedProduct.id,
        nome: updatedProduct.nome,
        estoque_atual: updatedProduct.estoque_atual,
        estoque_4andar: updatedProduct.estoque_4andar,
        estoque_5andar: updatedProduct.estoque_5andar,
      });

    } catch (error) {
      console.error('Erro ao registrar retirada:', error);
      alert('Erro ao registrar retirada.');
    }
  };


  return (
    <tr className="border-t">
      <td className="p-2">{formData.id}</td>
      <td className="p-2">{formData.nome}</td>
      <td className="p-2">{formData.estoque_atual}</td>
      <td className="p-2">{formData.estoque_4andar}</td>
      <td className="p-2">{formData.estoque_5andar}</td>
      <td className="p-2">
        <input
          type="number"
          name="retirada"
          value={formData.retirada}
          onChange={handleChange}
          min={0}
          max={formData.estoque_atual}
          className="w-full border px-2 py-1 rounded"
          placeholder="Qtd a retirar"
        />
      </td>
      <td className="p-2">
        <select
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="" disabled>Selecionar Andar</option>
          <option value="4º andar">4º andar</option>
          <option value="5º andar">5º andar</option>
        </select>
      </td>
      <td className="p-2">
        <button
          onClick={aplicarRetirada}
          disabled={!formData.retirada || !formData.destino}
          className={`px-3 py-1 rounded ${
            !formData.retirada || !formData.destino
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
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