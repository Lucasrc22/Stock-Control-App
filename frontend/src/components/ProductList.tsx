import { useEffect, useState } from 'react'

interface Produto {
  id: number
  nome: string
  data_retirada: string
  quantidade_retirada: number
  area_destinada: string
  responsavel_retirada: string
  saldo_estoque: number
}

export default function ProductList() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/produtos')
      .then((res) => res.json())
      .then((data) => setProdutos(data))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mt-4 mb-2">Produtos em Estoque</h2>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nome</th>
            <th className="border p-2">Data Retirada</th>
            <th className="border p-2">Quantidade Retirada</th>
            <th className="border p-2">Área Destinada</th>
            <th className="border p-2">Responsável Retirada</th>
            <th className="border p-2">Saldo em Estoque</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td className="border p-2">{produto.nome}</td>
              <td className="border p-2">{produto.data_retirada || '-'}</td>
              <td className="border p-2">{produto.quantidade_retirada}</td>
              <td className="border p-2">{produto.area_destinada || '-'}</td>
              <td className="border p-2">{produto.responsavel_retirada || '-'}</td>
              <td className="border p-2">{produto.saldo_estoque}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
