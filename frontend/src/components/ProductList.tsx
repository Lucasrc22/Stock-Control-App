import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../types';
import EditableProductRow from './EditableProductRow';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleProductChange(updatedProduct: Product) {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center shadow-md" role="alert">
        <strong className="font-semibold">Erro:</strong> <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">Estoque Atual</h2>
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
          <thead className="bg-[#E6F1FA] text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Nome</th>
              <th className="py-3 px-4 border">Estoque Atual</th>
              <th className="py-3 px-4 border">4º Andar</th>
              <th className="py-3 px-4 border">5º Andar</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {products.map((product) => (
              <EditableProductRow
                key={product.id}
                product={product}
                onChange={handleProductChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
