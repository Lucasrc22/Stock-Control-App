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

  useEffect(() => {
    axios.get('http://localhost:8000/products')
      .then(res => {
        const produtos = res.data
        setProducts(produtos)

        const maxId = produtos.reduce((max: number, p: Product) => p.id > max ? p.id : max, 0)
        setNewProduct(prev => ({ ...prev, id: maxId + 1 }))
      })
      .catch(err => console.error(err))
  }, [])

  const handleAddProduct = () => {
    if (!newProduct.nome.trim()) {
      alert("Nome do produto é obrigatório.")
      return
    }

    axios.post('http://localhost:8000/products', newProduct)
      .then(() => {
        const updated = [...products, newProduct]
        setProducts(updated)

        const nextId = updated.reduce((max, p) => p.id > max ? p.id : max, 0) + 1
        setNewProduct({ id: nextId, nome: '', estoque_atual: 0 })
      })
      .catch(err => console.error(err))
  }

  const handleEstoqueChange = (id: number, value: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, estoque_atual: value } : p
    )
    setProducts(updated)
  }

  const handleSaveAll = () => {
    axios.put('http://localhost:8000/products', products)
      .then(() => alert("Produtos atualizados com sucesso!"))
      .catch(err => console.error(err))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Produtos</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Estoque Atual</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>
                <input
                  type="number"
                  value={p.estoque_atual ?? 0}
                  onChange={e => handleEstoqueChange(p.id, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSaveAll} style={{ marginTop: '10px' }}>
        Salvar Tudo
      </button>

      <h2 style={{ marginTop: '30px' }}>Adicionar Produto</h2>
      <input type="number" value={newProduct.id} disabled />
      <input
        type="text"
        placeholder="Nome do Produto"
        value={newProduct.nome}
        onChange={e => setNewProduct({ ...newProduct, nome: e.target.value })}
      />
      <input
        type="number"
        placeholder="Estoque Atual"
        value={newProduct.estoque_atual}
        onChange={e => setNewProduct({ ...newProduct, estoque_atual: Number(e.target.value) })}
      />
      <button onClick={handleAddProduct}>Adicionar</button>
    </div>
  )
}
