import { useState, useEffect } from 'react'
import { Product } from '../types'

interface Props {
  product: Product
  onChange: (updatedProduct: Product) => void
  onSave: () => void

}

export default function EditableProductRow({ product, onChange, onSave }: Props) {
  const [estoqueAtual, setEstoqueAtual] = useState(product.estoque_atual)
  const [estoque4Andar, setEstoque4Andar] = useState(product.estoque_4andar ?? 0)
  const [estoque5Andar, setEstoque5Andar] = useState(product.estoque_5andar ?? 0)

  useEffect(() => {
    setEstoqueAtual(product.estoque_atual)
    setEstoque4Andar(product.estoque_4andar ?? 0)
    setEstoque5Andar(product.estoque_5andar ?? 0)
  }, [product])

  // Atualiza o produto no pai sempre que algum estoque mudar
  useEffect(() => {
    onChange({
      ...product,
      estoque_atual: estoqueAtual,
      estoque_4andar: estoque4Andar,
      estoque_5andar: estoque5Andar,
    })
  }, [estoqueAtual, estoque4Andar, estoque5Andar])

  return (
    <tr>
      <td className="border px-2 py-1">{product.id}</td>
      <td className="border px-2 py-1">{product.nome}</td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoqueAtual}
          onChange={e => setEstoqueAtual(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoque4Andar}
          onChange={e => setEstoque4Andar(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1">
        <input
          type="number"
          min={0}
          value={estoque5Andar}
          onChange={e => setEstoque5Andar(Number(e.target.value))}
          className="border rounded px-1 py-0.5 w-20"
        />
      </td>

      <td className="border px-2 py-1"> {/* aqui pode ter ações futuras se quiser */} </td>
    </tr>
  )
}
