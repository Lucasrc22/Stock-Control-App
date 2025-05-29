import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 p-6 rounded-xl shadow-lg"
      style={{ backgroundColor: '#F4F7F9' }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Adicionar Novo Produto</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-green-600 mb-2"
        >
          Produto adicionado com sucesso!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            value={newProduct.estoque_atual}
            onChange={(e) =>
              setNewProduct({ ...newProduct, estoque_atual: parseInt(e.target.value) || 0 })
            }
            disabled={loading}
          />
        </div>
        <div className="flex space-x-4 justify-end">
          <button
            type="reset"
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => setNewProduct({ nome: '', estoque_atual: 0 })}
            disabled={loading}
          >
            Limpar
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
              loading ? 'bg-gray-400' : 'bg-[#A7C7E7] hover:bg-blue-300'
            }`}
          >
            {loading ? 'Adicionando...' : 'Adicionar Produto'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
