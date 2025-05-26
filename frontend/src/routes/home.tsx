import { useState, useEffect } from 'react'
import axios from 'axios'

interface Product {
  id: number
  nome: string
  estoque_atual: number | null
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ id: 1, nome: '', estoque_atual: 0 })

  // Carrega os produtos ao iniciar
  useEffect(() => {
    axios.get('http://localhost:8000/products')
      .then(res => {
        setProducts(res.data)

        // Gera novo ID automaticamente (maior ID + 1)
        const maxId = res.data.reduce((max: number, p: Product) => p.id > max ? p.id : max, 0)
        setNewProduct(prev => ({ ...prev, id: maxId + 1 }))
      })
      .catch(err => console.error(err))
  }, [])

  // Adiciona o produto e já gera um novo ID
  const handleAddProduct = () => {
    axios.post('http://localhost:8000/products', newProduct)
      .then(() => {
        const updatedProducts = [...products, newProduct]
        setProducts(updatedProducts)

        // Novo ID: maior ID da nova lista + 1
        const maxId = updatedProducts.reduce((max, p) => p.id > max ? p.id : max, 0)
        setNewProduct({ id: maxId + 1, nome: '', estoque_atual: 0 })
      })
      .catch(err => console.error(err))
  }

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Estoque Atual</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.nome}</td><td>{p.estoque_atual}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Adicionar Produto</h2>
      {/* O ID agora está desabilitado, pois é gerado automaticamente */}
      <input type="number" value={newProduct.id} disabled />
      <input
        type="text"
        placeholder="Nome"
        value={newProduct.nome}
        onChange={e => setNewProduct({ ...newProduct, nome: e.target.value })}
      />
      <input
        type="number"
        placeholder="Estoque"
        value={newProduct.estoque_atual}
        onChange={e => setNewProduct({ ...newProduct, estoque_atual: Number(e.target.value) })}
      />
      <button onClick={handleAddProduct}>Adicionar</button>
    </div>
  )
}
