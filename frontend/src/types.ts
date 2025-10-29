export interface Product {
  id: number;
  nome: string;
  estoque_atual: number;
  estoque_4andar: number;
  estoque_5andar: number;
}

export interface Setor {
    id: number;
    total: number
    item: string;
    financeiro: number;
    fiscal: number;
    ti: number;
    comercial: number;
    rh: number;
    dp: number;
    suprimentos: number;
    juridico: number;
}