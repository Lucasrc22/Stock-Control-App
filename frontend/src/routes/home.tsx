import { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
  id: number
  nome: string
  estoque_atual: number | null
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
  axios.get<Product[]>('http://localhost:8000/products')
    .then(res => setProducts(res.data))
    .catch(err => console.error(err))
}, [])


  return (
    <div>
      <h1>Stock Control App</h1>
      <h2>Bem-vindo à Home!</h2>

      <h3>Lista de Produtos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Estoque Atual</th>
            <th>Ação</th>
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
                  value={p.estoque_atual ?? ''}
                  onChange={(e) => {
                    const updated = products.map(prod =>
                      prod.id === p.id
                        ? { ...prod, estoque_atual: parseInt(e.target.value) }
                        : prod
                    )
                    setProducts(updated)
                  }}
                />
              </td>
              <td>📝</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          axios.put('http://localhost:8000/products', products)
            .then(() => alert('Produtos atualizados!'))
            .catch(err => console.error(err))
        }}
      >
        Salvar Tudo
      </button>
    </div>
  )
}
