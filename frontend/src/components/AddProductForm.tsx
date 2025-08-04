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
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, newProduct);
      setNewProduct({ nome: '', estoque_atual: 0 });
      setSuccess(true);
      onAdd();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erro ao adicionar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 rounded-2xl shadow-xl bg-white"
    >
      <h2 className="text-2xl font-bold text-center text-black mb-4">Adicionar Produto</h2>

      {error && <div className="text-red-500 mb-2 text-sm text-center">{error}</div>}
      {success && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-green-600 mb-2 text-sm text-center"
        >
          Produto adicionado com sucesso!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Nome do Produto</label>
          <input
            type="text"
            className="input-style"
            placeholder="Ex: Papel A4"
            value={newProduct.nome}
            onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Estoque Inicial</label>
          <input
            type="number"
            min="0"
            className="input-style"
            value={newProduct.estoque_atual}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                estoque_atual: Number(e.target.value) >= 0 ? Number(e.target.value) : 0
              })
            }
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="reset"
            className="btn-secondary"
            onClick={() => setNewProduct({ nome: '', estoque_atual: 0 })}
            disabled={loading}
          >
            Limpar
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
