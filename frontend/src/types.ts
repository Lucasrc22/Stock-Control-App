export type Product = {
  id: number;
  nome: string;
  estoque_atual: number;
  estoque_4andar?: number;
  estoque_5andar?: number;
  retirada?: number;
  destino?: string;
};
