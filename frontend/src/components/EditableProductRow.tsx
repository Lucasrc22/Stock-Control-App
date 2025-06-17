import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';

interface Props {
  product: Product;
  onChange: (updatedProduct: Product) => void;
}

export default function EditableProductRow({ product, onChange }: Props) {
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [quantidadeRetirada, setQuantidadeRetirada] = useState(0);
  const [andarRetirada, setAndarRetirada] = useState('4º andar');
  const [loading, setLoading] = useState(false);
  const [savingEstoqueAtual, setSavingEstoqueAtual] = useState(false);

  useEffect(() => {
    setEstoqueAtual(product.estoque_atual);
  }, [product]);

  useEffect(() => {
    if (estoqueAtual === product.estoque_atual) return;

    const timer = setTimeout(() => {
      saveEstoqueAtual();
    }, 800);

    return () => clearTimeout(timer);
  }, [estoqueAtual]);

  async function saveEstoqueAtual() {
    setSavingEstoqueAtual(true);
    try {
      const updatedProductData: Omit<Product, 'id'> = {
      nome: product.nome,
      estoque_atual: estoqueAtual,
      estoque_4andar: product.estoque_4andar ?? 0,
      estoque_5andar: product.estoque_5andar ?? 0,
    };



      const updatedProduct = await productService.updateProduct(product.id, updatedProductData);

      onChange(updatedProduct);
    } catch (error) {
      console.error('Erro ao salvar estoque atual:', error);
      alert('Erro ao salvar estoque atual');
    } finally {
      setSavingEstoqueAtual(false);
    }
  }

  async function handleRegisterWithdrawal() {
    if (quantidadeRetirada <= 0) {
      alert('Informe uma quantidade válida para retirada');
      return;
    }

    setLoading(true);
    try {
      const response = await productService.registerWithdrawal({
        id: product.id,
        quantidade: quantidadeRetirada,
        andar: andarRetirada,
      });

      if (response.produto) {
        onChange(response.produto);
      } else {
        alert('Retirada registrada, mas não foi possível atualizar localmente');
      }


      setQuantidadeRetirada(0);
      setShowWithdrawal(false);
    } catch (error) {
      console.error('Erro ao registrar retirada:', error);
      alert('Erro ao registrar retirada');
    } finally {
      setLoading(false);
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
        {savingEstoqueAtual && (
          <div className="text-xs text-gray-400 mt-1 animate-pulse">Salvando...</div>
        )}
      </td>
      <td className="border px-3 py-2 text-center text-gray-700 select-none">
        {product.estoque_4andar ?? 0}
      </td>
      <td className="border px-3 py-2 text-center text-gray-700 select-none">
        {product.estoque_5andar ?? 0}
      </td>
      <td className="border px-3 py-2 text-center">
        {!showWithdrawal && (
          <button
            onClick={() => setShowWithdrawal(true)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
          >
            Registrar Retirada
          </button>
        )}
        {showWithdrawal && (
          <div className="mt-2 flex flex-col items-center space-y-2">
            <input
              type="number"
              min={1}
              value={quantidadeRetirada}
              onChange={e => setQuantidadeRetirada(Number(e.target.value))}
              placeholder="Quantidade"
              className="w-24 border border-gray-300 rounded px-2 py-1 text-center"
            />
            <select
              value={andarRetirada}
              onChange={e => setAndarRetirada(e.target.value)}
              className="w-24 border border-gray-300 rounded px-2 py-1"
            >
              <option value="4º andar">4º andar</option>
              <option value="5º andar">5º andar</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleRegisterWithdrawal}
                disabled={loading}
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowWithdrawal(false)}
                disabled={loading}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
