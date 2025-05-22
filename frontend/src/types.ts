export type Product = {
  id: number;
  nome: string;
  estoque_atual?: number;
  data_entrada?: string;
  data_saida?: string;
  destinatario?: string;
  quantidade_retirada?: number;
};
