import { useState } from 'react';
import ProductList from '../components/ProductList';
import AddProductForm from '../components/AddProductForm';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddProduct = () => {
    setRefreshKey(prev => prev + 1); 
  };

  return (
    <div
      className="min-h-screen py-8"
      style={{
        /*backgroundImage: "url('/assets/background.jpg')",*/
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        
        {/* Seção Principal */}
        <div className="p-6 mb-8">
          <ProductList key={refreshKey} />
        </div>
        
        {/* Seção de Adição */}
        <div className="p-6">
          <AddProductForm onAdd={handleAddProduct} />
        </div>
      </div>
    </div>
  );
}
