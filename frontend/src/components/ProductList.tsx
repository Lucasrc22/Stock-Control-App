import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:8000/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (id: number) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product || !product.retirada || !product.destino) return;

      await axios.post('http://localhost:8000/products/retirada', {
        id,
        quantidade: product.retirada,
        andar: product.destino
      });
      
      fetchProducts(); 
    } catch (err) {
      setError('Erro ao registrar retirada');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Controle de Estoque</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nome</th>
              <th className="py-2 px-4 border">Estoque Atual</th>
              <th className="py-2 px-4 border">4º Andar</th>
              <th className="py-2 px-4 border">5º Andar</th>
              <th className="py-2 px-4 border">Retirar</th>
              <th className="py-2 px-4 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border text-center">{product.id}</td>
                <td className="py-2 px-4 border">{product.nome}</td>
                <td className="py-2 px-4 border text-center">{product.estoque_atual}</td>
                <td className="py-2 px-4 border text-center">{product.estoque_4andar}</td>
                <td className="py-2 px-4 border text-center">{product.estoque_5andar}</td>
                <td className="py-2 px-4 border">
                  <div className="flex flex-col space-y-2">
                    <input
                      type="number"
                      min="0"
                      max={product.estoque_atual}
                      className="w-full px-2 py-1 border rounded"
                      value={product.retirada || ''}
                      onChange={e => {
                        const value = parseInt(e.target.value) || 0;
                        setProducts(products.map(p => 
                          p.id === product.id ? { ...p, retirada: value } : p
                        ));
                      }}
                    />
                    <select
                      className="w-full px-2 py-1 border rounded"
                      value={product.destino || ''}
                      onChange={e => {
                        setProducts(products.map(p => 
                          p.id === product.id ? { ...p, destino: e.target.value } : p
                        ));
                      }}
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="4º andar">4º Andar</option>
                      <option value="5º andar">5º Andar</option>
                    </select>
                  </div>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleWithdrawal(product.id)}
                    disabled={!product.retirada || !product.destino}
                    className={`w-full px-4 py-1 rounded ${
                      !product.retirada || !product.destino
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Aplicar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}