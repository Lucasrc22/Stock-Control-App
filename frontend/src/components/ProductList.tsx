import { useEffect, useState } from 'react';
import EditableProductRow from './EditableProductRow';
import type { Product } from '../types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('http://localhost:8000/products')
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);  // Já que o backend retorna uma lista simples, não precisa de data.products
      setLoading(false);  // <- importante parar o loading aqui!
    })
    .catch((err) => {
      console.error(err);
      setProducts([]);
      setLoading(false);  // Também parar o loading em caso de erro
    });
}, []);



  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const saveAllToBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar os produtos');
      }

      alert('Produtos salvos com sucesso!');
    } catch (error) {
      alert('Erro ao salvar: ' + (error as Error).message);
    }
  };

  if (loading) return <div>Carregando produtos...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Produtos</h2>
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Estoque Atual</th>
            <th>Data Entrada</th>
            <th>Data Saída</th>
            <th>Destinatário</th>
            <th>Quantidade Retirada</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <EditableProductRow
              key={product.id}
              product={product}
              onSave={handleSave}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={saveAllToBackend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Salvar Tudo
        </button>
      </div>
    </div>
  );
}
