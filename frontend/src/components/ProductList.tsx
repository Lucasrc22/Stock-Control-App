import { useState } from 'react'
import EditableProductRow from './EditableProductRow'

type Product = {
  id: number
  nome: string
  estoque_atual?: number
  data_entrada?: string
  data_saida?: string
  destinatario?: string
  quantidade_retirada?: number
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, nome: 'Produto A' },
    { id: 2, nome: 'Produto B' },
  ])

  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Estoque Atual</th>
          <th>Data Entrada</th>
          <th>Data Saída</th>
          <th>Destinatário</th>
          <th>Quantidade Retirada</th>
          <th>Ações</th>
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
  )
}
