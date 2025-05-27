import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../types';
import EditableProductRow from './EditableProductRow';

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    axios.get('http://localhost:8000/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Controle de Estoque</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nome</th>
            <th className="border px-2 py-1">Estoque Atual</th>
            <th className="border px-2 py-1">4º Andar</th>
            <th className="border px-2 py-1">5º Andar</th>
            <th className="border px-2 py-1">Retirada</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <EditableProductRow
              key={product.id}
              product={product}
              onSave={fetchProducts}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
