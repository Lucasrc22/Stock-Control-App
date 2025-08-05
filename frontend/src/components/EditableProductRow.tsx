import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import '../styles/EditableProductRow.css';
import MovimentacaoList from './MovimentacaoList';

interface Props {
  product: Product;
  onChange: (updatedProduct: Product) => void;
}

export default function EditableProductRow({ product, onChange }: Props) {
  const [quantidadeRetirada, setQuantidadeRetirada] = useState(0);
  const [quantidadeConsumo, setQuantidadeConsumo] = useState(0);
  const [andarRetirada, setAndarRetirada] = useState('4');
  const [andarConsumo, setAndarConsumo] = useState('4');
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showConsumo, setShowConsumo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addEstoque, setAddEstoque] = useState(0);
  const [showAddEstoque, setShowAddEstoque] = useState(false);

  useEffect(() => {
    
    setQuantidadeRetirada(0);
    setQuantidadeConsumo(0);
    setAddEstoque(0);
    setShowWithdrawal(false);
    setShowConsumo(false);
  }, [product]);

  async function handleRegisterWithdrawal() {
    if (quantidadeRetirada <= 0) return alert('Informe uma quantidade válida para retirada');
    setLoading(true);
    try {
      const response = await productService.registerWithdrawal({
        id: product.id,
        quantidade: quantidadeRetirada,
        andar: andarRetirada,
      });
      onChange(response.produto);
      setQuantidadeRetirada(0);
      setShowWithdrawal(false);
    } catch {
      alert('Erro ao registrar retirada');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterConsumo() {
    if (quantidadeConsumo <= 0) return alert('Informe uma quantidade válida para consumo');
    setLoading(true);
    try {
      const response = await productService.consumirProduto({
        id: product.id,
        quantidade: quantidadeConsumo,
        andar: andarConsumo,
      });
      onChange(response.produto);
      setQuantidadeConsumo(0);
      setShowConsumo(false);
    } catch {
      alert('Erro ao registrar consumo');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdicionarEstoque() {
    if (addEstoque <= 0) return alert('Informe uma quantidade válida para adicionar');
    setLoading(true);
    try {
      const updated = await productService.updateProduct(product.id, {
        nome: product.nome,
        estoque_atual: product.estoque_atual + addEstoque,
        estoque_4andar: product.estoque_4andar ?? 0,
        estoque_5andar: product.estoque_5andar ?? 0,
      });
      onChange(updated);
      setAddEstoque(0);
    } catch {
      alert('Erro ao adicionar estoque');
    } finally {
      setLoading(false);
    }
  }

  return (
  <tr className="transition hover:bg-blue-50 border-b-2 border-gray-200">
    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2">{product.id}</div>
    </td>
    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2">{product.nome}</div>
    </td>

    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2">
        <input
          type="number"
          className="input-quantidade"
          value={product.estoque_atual}
          readOnly
        />

        {!showAddEstoque && (
          <button
            onClick={() => setShowAddEstoque(true)}
            className="button-action bg-green-600 text-white mt-2"
          >
            Adicionar Estoque
          </button>
        )}

        {showAddEstoque && (
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              min={1}
              className="input-quantidade"
              placeholder="Qtd. a adicionar"
              value={addEstoque}
              onChange={e => setAddEstoque(Number(e.target.value))}
            />
            <button
              onClick={handleAdicionarEstoque}
              disabled={loading}
              className="button-action bg-green-600 text-white"
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                setShowAddEstoque(false);
                setAddEstoque(0);
              }}
              className="button-action bg-red-600 text-white"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </td>

    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2">{product.estoque_4andar}</div>
    </td>
    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2">{product.estoque_5andar}</div>
    </td>

    <td className="bloco-produto">
      <div className="bg-white/60 rounded-xl p-2 space-y-2">
        <MovimentacaoList productId={product.id} />

        {!showWithdrawal && (
          <button
            onClick={() => setShowWithdrawal(true)}
            className="button-action bg-blue-600 text-white"
          >
            Andar Destinado
          </button>
        )}
        {showWithdrawal && (
          <div className="space-y-2">
            <input
              type="number"
              min={1}
              value={quantidadeRetirada}
              onChange={e => setQuantidadeRetirada(Number(e.target.value))}
              className="input-quantidade"
              placeholder="Qtd."
            />
            <select
              value={andarRetirada}
              onChange={e => setAndarRetirada(e.target.value)}
              className="select-small"
            >
              <option value="4º andar">4º andar</option>
              <option value="5º andar">5º andar</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={handleRegisterWithdrawal}
                disabled={loading}
                className="button-action bg-green-600 text-white"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowWithdrawal(false)}
                className="button-action bg-red-600 text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {!showConsumo && (
          <button
            onClick={() => setShowConsumo(true)}
            className="button-action bg-purple-600 text-white"
          >
            Registrar Consumo
          </button>
        )}
        {showConsumo && (
          <div className="space-y-2">
            <input
              type="number"
              min={1}
              value={quantidadeConsumo}
              onChange={e => setQuantidadeConsumo(Number(e.target.value))}
              className="input-quantidade"
              placeholder="Qtd."
            />
            <select
              value={andarConsumo}
              onChange={e => setAndarConsumo(e.target.value)}
              className="select-small"
            >
              <option value="4">4º andar</option>
              <option value="5">5º andar</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleRegisterConsumo}
                disabled={loading}
                className="button-action bg-green-600 text-white"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConsumo(false)}
                className="button-action bg-red-600 text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </td>
  </tr>
);


}
