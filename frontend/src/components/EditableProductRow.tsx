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
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual);
  const [quantidadeRetirada, setQuantidadeRetirada] = useState(0);
  const [quantidadeConsumo, setQuantidadeConsumo] = useState(0);
  const [andarRetirada, setAndarRetirada] = useState('4');
  const [andarConsumo, setAndarConsumo] = useState('4');
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showConsumo, setShowConsumo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingEstoqueAtual, setSavingEstoqueAtual] = useState(false);

  useEffect(() => {
    setEstoqueAtual(product.estoque_atual);
  }, [product]);

  useEffect(() => {
    if (estoqueAtual === product.estoque_atual) return;
    const timer = setTimeout(() => saveEstoqueAtual(), 800);
    return () => clearTimeout(timer);
  }, [estoqueAtual]);

  async function saveEstoqueAtual() {
    setSavingEstoqueAtual(true);
    try {
      const updatedProduct = await productService.updateProduct(product.id, {
        nome: product.nome,
        estoque_atual: estoqueAtual,
        estoque_4andar: product.estoque_4andar ?? 0,
        estoque_5andar: product.estoque_5andar ?? 0,
      });
      onChange(updatedProduct);
    } catch (error) {
      alert('Erro ao salvar estoque atual');
    } finally {
      setSavingEstoqueAtual(false);
    }
  }

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

  return (
    <tr className="transition hover:bg-blue-50">
      <td className="border px-3 py-4 text-center">{product.id}</td>
      <td className="border px-3 py-2">{product.nome}</td>
      <td className="border px-3 py-4 text-center">
        <input
          type="number"
          min={0}
          value={estoqueAtual}
          onChange={e => setEstoqueAtual(Number(e.target.value))}
          className="input-small"
        />
        {savingEstoqueAtual && <div className="spinner-text">Salvando...</div>}
      </td>
      <td className="border px-3 py-4 text-center">{product.estoque_4andar}</td>
      <td className="border px-3 py-4 text-center">{product.estoque_5andar}</td>
      <td className="border px-3 py-4 text-center space-y-1 relative">

        {/* Botão / popover do histórico de movimentação */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
          <MovimentacaoList productId={product.id} />
        </div>

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
              className="input-small"
              placeholder="Qtd."
            />
            <select
              value={andarRetirada}
              onChange={(e) => setAndarRetirada(e.target.value)}
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
              className="input-small"
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
      </td>
    </tr>
  );
}
