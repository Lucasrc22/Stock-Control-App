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
  const [showAddEstoque, setShowAddEstoque] = useState(false);

  const [addEstoque, setAddEstoque] = useState(0);
  const [loading, setLoading] = useState(false);

  // edição de nome
  const [editNome, setEditNome] = useState(false);
  const [nomeEditavel, setNomeEditavel] = useState(product.nome);

  useEffect(() => {
    setQuantidadeRetirada(0);
    setQuantidadeConsumo(0);
    setAddEstoque(0);
    setShowWithdrawal(false);
    setShowConsumo(false);
    setShowAddEstoque(false);
    setEditNome(false);
    setNomeEditavel(product.nome);
  }, [product]);

  async function handleSalvarNome() {
    if (!nomeEditavel.trim()) {
      return alert('O nome do produto não pode ser vazio');
    }

    setLoading(true);
    try {
      const updated = await productService.updateProduct(product.id, {
        nome: nomeEditavel,
        estoque_atual: product.estoque_atual,
        estoque_4andar: product.estoque_4andar ?? 0,
        estoque_5andar: product.estoque_5andar ?? 0,
      });

      onChange(updated);
      setEditNome(false);
    } catch {
      alert('Erro ao atualizar nome do produto');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdicionarEstoque() {
    if (addEstoque <= 0 || loading) {
      return alert('Informe uma quantidade válida');
    }

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
      setShowAddEstoque(false);
    } catch {
      alert('Erro ao adicionar estoque');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterWithdrawal() {
    if (quantidadeRetirada <= 0 || loading) {
      return alert('Quantidade inválida');
    }

    setLoading(true);
    try {
      const response = await productService.registerWithdrawal({
        id: product.id,
        quantidade: quantidadeRetirada,
        andar: andarRetirada,
      });

      onChange(response.produto);
      setShowWithdrawal(false);
    } catch {
      alert('Erro ao registrar retirada');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterConsumo() {
    if (quantidadeConsumo <= 0 || loading) {
      return alert('Quantidade inválida');
    }

    setLoading(true);
    try {
      const response = await productService.consumirProduto({
        id: product.id,
        quantidade: quantidadeConsumo,
        andar: andarConsumo,
      });

      onChange(response.produto);
      setShowConsumo(false);
    } catch {
      alert('Erro ao registrar consumo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr className="transition hover:bg-blue-50 border-b-2 border-gray-200">
      <td>{product.id}</td>

      {/* nome */}
      <td>
        {!editNome ? (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{product.nome}</span>
            <button
              onClick={() => setEditNome(true)}
              className="button-action bg-blue-500 text-white"
            >
              ✏️
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={nomeEditavel}
              onChange={e => setNomeEditavel(e.target.value)}
              className="input-quantidade"
            />
            <button
              onClick={handleSalvarNome}
              disabled={loading}
              className="button-action bg-green-600 text-white"
            >
              ✔
            </button>
            <button
              onClick={() => {
                setEditNome(false);
                setNomeEditavel(product.nome);
              }}
              className="button-action bg-red-600 text-white"
            >
              ✖
            </button>
          </div>
        )}
      </td>

      <td>{product.estoque_atual}</td>
      <td>{product.estoque_4andar}</td>
      <td>{product.estoque_5andar}</td>

      {/* ações */}
      <td>
        <MovimentacaoList productId={product.id} />

        {/* adicionar estoque geral */}
        {!showAddEstoque && (
          <button
            onClick={() => setShowAddEstoque(true)}
            className="button-action bg-green-500 text-white mt-2"
          >
          Adicionar Estoque
          </button>
        )}

        {showAddEstoque && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="number"
              value={addEstoque}
              onChange={e => setAddEstoque(Number(e.target.value))}
              className="input-quantidade"
              placeholder="Qtd"
            />
            <button
              onClick={handleAdicionarEstoque}
              disabled={loading}
              className="button-action bg-green-600 text-white"
            >
              ✔
            </button>
            <button
              onClick={() => {
                setShowAddEstoque(false);
                setAddEstoque(0);
              }}
              className="button-action bg-red-600 text-white"
            >
              ✖
            </button>
          </div>
        )}

        {/* retirada */}
        {!showWithdrawal && (
          <button
            onClick={() => setShowWithdrawal(true)}
            className="button-action bg-yellow-500 text-white mt-2"
          >
            Andar Destinado
          </button>
        )}

        {showWithdrawal && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="number"
              value={quantidadeRetirada}
              onChange={e => setQuantidadeRetirada(Number(e.target.value))}
              className="input-quantidade"
            />
            <select
              value={andarRetirada}
              onChange={e => setAndarRetirada(e.target.value)}
            >
              <option value="4">4º andar</option>
              <option value="5">5º andar</option>
            </select>
            <button
              onClick={handleRegisterWithdrawal}
              className="button-action bg-green-600 text-white"
            >
              ✔
            </button>
            <button
              onClick={() => {
                setShowWithdrawal(false);
                setQuantidadeRetirada(0);
              }}
              className="button-action bg-red-600 text-white"
            >
              ✖
            </button>
          </div>
        )}

        {/* consumo */}
        {!showConsumo && (
          <button
            onClick={() => setShowConsumo(true)}
            className="button-action bg-red-500 text-white mt-2"
          >
            Registrar Consumo
          </button>
        )}

        {showConsumo && (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="number"
              value={quantidadeConsumo}
              onChange={e => setQuantidadeConsumo(Number(e.target.value))}
              className="input-quantidade"
            />
            <select
              value={andarConsumo}
              onChange={e => setAndarConsumo(e.target.value)}
            >
              <option value="4">4º andar</option>
              <option value="5">5º andar</option>
            </select>
            <button
              onClick={handleRegisterConsumo}
              className="button-action bg-green-600 text-white"
            >
              ✔
            </button>
            <button
              onClick={() => {
                setShowConsumo(false);
                setQuantidadeConsumo(0);
              }}
              className="button-action bg-red-600 text-white"
            >
              ✖
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
