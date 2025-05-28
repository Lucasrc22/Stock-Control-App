import { useState } from 'react';
import axios from 'axios';

export default function AddProductForm({ onAdd }: { onAdd: () => void }) {
  const [newProduct, setNewProduct] = useState({ nome: '', estoque_atual: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newProduct.nome.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/products', newProduct);
      setNewProduct({ nome: '', estoque_atual: 0 });
      setSuccess(true);
      onAdd();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Erro ao adicionar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Adicionar Novo Produto</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Produto adicionado com sucesso!</div>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newProduct.nome}
            onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estoque Inicial</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newProduct.estoque_atual}
            onChange={(e) =>
              setNewProduct({ ...newProduct, estoque_atual: parseInt(e.target.value) || 0 })
            }
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex justify-center py-2 px-4 rounded-md text-white text-sm font-medium ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
}
