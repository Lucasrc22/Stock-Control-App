import React, { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  quantity: number
  location: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ajuste a URL para a rota correta do seu backend
    fetch('http://localhost:8000/products')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar produtos: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data: Product[]) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Carregando produtos...</p>
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>

  return (
    <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Quantidade</th>
          <th>Localização</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center' }}>Nenhum produto encontrado</td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.location}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
