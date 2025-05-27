import { useState, useEffect } from 'react'
import axios from 'axios'

interface Product {
  id: number
  nome: string
  estoque_atual: number | null
  retirada?: number
  destino?: string
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

  const handleAddProduct = async () => {
  try {
    const response = await axios.post('http://localhost:8000/products', {
      nome: newProduct.nome,
      estoque_atual: newProduct.estoque_atual
    });
    setProducts([...products, response.data]);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
}

  const handleEstoqueChange = (id: number, value: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, estoque_atual: value } : p
    )
    setProducts(updated)
  }

  const handleRetiradaChange = (id: number, quantidade: number) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, retirada: quantidade } : p)
    )
  }

  const handleDestinoChange = (id: number, destino: string) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, destino } : p)
    )
  }

  const aplicarRetirada = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id && p.retirada && p.destino) {
          const novoEstoque = (p.estoque_atual ?? 0) - p.retirada
          if (novoEstoque < 0) {
            alert("Estoque insuficiente.")
            return p
          }
          alert(`Produto destinado ao ${p.destino}`)
          return { ...p, estoque_atual: novoEstoque, retirada: 0, destino: '' }
        }
        return p
      })
    )
  }

  const handleSaveAll = () => {
    axios.put('http://localhost:8000/products', products)
      .then(() => alert("Produtos atualizados com sucesso!"))
      .catch(err => console.error(err))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stock Control</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Estoque Atual</th>
            <th>Retirar</th>
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
              <td>
                <input
                  type="number"
                  placeholder="Qtd"
                  min={1}
                  max={p.estoque_atual ?? 1}
                  value={p.retirada ?? ''}
                  onChange={e => handleRetiradaChange(p.id, Number(e.target.value))}
                  style={{ width: '70px' }}
                />
                <select
                  onChange={e => handleDestinoChange(p.id, e.target.value)}
                  value={p.destino ?? ''}
                  style={{ marginLeft: '10px' }}
                >
                  <option value="" disabled>Andar</option>
                  <option value="4º andar">4º andar</option>
                  <option value="5º andar">5º andar</option>
                </select>
                <button
                  onClick={() => aplicarRetirada(p.id)}
                  disabled={!p.retirada || !p.destino}
                  style={{ marginLeft: '10px' }}
                >
                  Aplicar
                </button>
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
        style={{ marginLeft: '10px' }}
      />
      <input
        type="number"
        placeholder="Estoque Atual"
        value={newProduct.estoque_atual}
        onChange={e => setNewProduct({ ...newProduct, estoque_atual: Number(e.target.value) })}
        style={{ marginLeft: '10px' }}
      />
      <button onClick={handleAddProduct} style={{ marginLeft: '10px' }}>
        Adicionar
      </button>
    </div>
  )
}
