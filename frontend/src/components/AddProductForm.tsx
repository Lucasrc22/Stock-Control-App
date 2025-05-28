import { useState } from 'react';
import axios from 'axios';

export default function AddProductForm({ onAdd }: { onAdd: () => void }) {
  const [newProduct, setNewProduct] = useState({
    nome: '',
    estoque_atual: 0
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nome.trim()) {
      setError('Nome do produto é obrigatório');
      return;
    }

    try {
      await axios.post('http://localhost:8000/products', newProduct);
      setNewProduct({ nome: '', estoque_atual: 0 });
      setError('');
      onAdd();
    } catch (err) {
      setError('Erro ao adicionar produto');
      console.error(err);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Adicionar Novo Produto</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newProduct.nome}
            onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estoque Inicial</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={newProduct.estoque_atual}
            onChange={(e) => setNewProduct({ ...newProduct, estoque_atual: parseInt(e.target.value) || 0 })}
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}