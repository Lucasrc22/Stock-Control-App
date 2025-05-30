import { useState } from 'react';
import ProductList from '../components/ProductList';
import AddProductForm from '../components/AddProductForm';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddProduct = () => {
    setRefreshKey(prev => prev + 1); 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seção Principal */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <ProductList key={refreshKey} />
        </div>
        
        {/* Seção de Adição */}
        <div className="bg-white shadow rounded-lg p-6">
          <AddProductForm onAdd={handleAddProduct} />
        </div>
      </div>
    </div>
  );
}