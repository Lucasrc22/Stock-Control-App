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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nome</th>
              <th className="py-2 px-4 border">Estoque Atual</th>
              <th className="py-2 px-4 border">4º Andar</th>
              <th className="py-2 px-4 border">5º Andar</th>
              <th className="py-2 px-4 border">Status</th>

            </tr>
          </thead>
          <tbody>
  {products.map(product => (
    
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
