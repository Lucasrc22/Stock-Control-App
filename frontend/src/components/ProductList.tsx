import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import EditableProductRow from './EditableProductRow';
import { Product } from '../types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Controle de Estoque</h2>
      <table className="w-full table-auto border-collapse border border-gray-200 shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Estoque Atual</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Estoque 4º</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Estoque 5º</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Retirar</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Total Retirado 4º</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Total Retirado 5º</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <EditableProductRow
              key={product.id}
              product={product}
              estoque_4andar={product.estoque_4andar ?? 0}
              estoque_5andar={product.estoque_5andar ?? 0}
              onSave={fetchProducts}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}