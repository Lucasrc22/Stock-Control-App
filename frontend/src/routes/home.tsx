import { useState, useEffect } from 'react'
import axios from 'axios'

interface Product {
  id: number
  nome: string
  estoque_atual: number | null
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ id: 0, nome: '', estoque_atual: 0 })

  useEffect(() => {
    axios.get('http://localhost:8000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleAddProduct = () => {
    axios.post('http://localhost:8000/products', newProduct)
      .then(() => {
        setProducts(prev => [...prev, newProduct])
        setNewProduct({ id: 0, nome: '', estoque_atual: 0 })
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
      <input
        type="number"
        placeholder="ID"
        value={newProduct.id}
        onChange={e => setNewProduct({ ...newProduct, id: Number(e.target.value) })}
      />
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
