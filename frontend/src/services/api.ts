import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- PRODUCT TYPES & SERVICE ---------- //

export interface Product {
  id: number;
  nome: string;
  estoque_atual: number;
  estoque_4andar: number;
  estoque_5andar: number;
}

interface WithdrawalData {
  id: number;
  quantidade: number;
  andar: string;
}
interface ConsumoData {
  id: number;
  quantidade: number;
  andar: string; // deve ser "4" ou "5"
}
export interface WithdrawalResponse {
  message: string;
  produto: Product;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  create: async (product: Pick<Product, 'nome' | 'estoque_atual'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  registerWithdrawal: async (data: WithdrawalData): Promise<WithdrawalResponse> => {
    const response = await api.post('/products/retirada', data);
    return response.data;
  },

  updateProduct: async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  consumirProduto: async (data: ConsumoData): Promise<WithdrawalResponse> => {
    const response = await api.post('/products/consumo', data);
    return response.data;
  },
};

// ---------- SETOR TYPES & SERVICE ---------- //

export interface Setor {
  id: number;
  item: string;

  total: number;
  financeiro: number;
  fiscal: number;
  ti: number;
  comercial: number;
  rh: number;
  dp: number;
  suprimentos: number;
  juridico: number;
}

/**
 * DTO para CREATE e UPDATE
 * (não envia id no body)
 */
export type SetorPayload = Omit<Setor, 'id'>;

// ---------- SETOR SERVICE ---------- //

export const setorService = {
  getAll: async (): Promise<Setor[]> => {
    const response = await api.get('/setores');
    return response.data;
  },

  /**
   * Atualiza um setor existente
   * id vai na URL
   * payload SEM id
   */
  updateSetor: async (
    id: number,
    setor: SetorPayload
  ): Promise<Setor> => {
    const response = await api.put(`/setores/${id}`, setor);
    return response.data;
  },

  /**
   * Cria um novo setor
   */
  createSetor: async (
    setor: SetorPayload
  ): Promise<Setor> => {
    const response = await api.post('/setores', setor);
    return response.data;
  },
};

export default api;
