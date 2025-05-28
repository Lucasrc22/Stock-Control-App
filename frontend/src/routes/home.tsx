import { useEffect, useState } from 'react'
import { productService } from '@/services/api'
import AddProductForm from '@/components/AddProductForm'
import EditableProductRow from '@/components/EditableProductRow'

export interface Product {
  id: number;
  nome: string;
  estoque_atual: number;
  estoque_4andar?: number;
  estoque_5andar?: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }

  const handleProductChange = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  const handleSaveAll = async () => {
    try {
      await productService.updateProducts(products)
      alert('Produtos atualizados com sucesso!')
    } catch (error) {
      alert('Erro ao salvar produtos.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Controle de Estoque</h1>

      <table className="w-full text-left border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Estoque Atual</th>
            <th className="p-2 border">Estoque 4º Andar</th>
            <th className="p-2 border">Estoque 5º Andar</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <EditableProductRow
              key={product.id}
              product={product}
              onChange={handleProductChange}
              onSave={handleSaveAll}
    />
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSaveAll}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Salvar Tudo
      </button>

      <AddProductForm onAdd={fetchProducts} />
    </div>
  )
}
