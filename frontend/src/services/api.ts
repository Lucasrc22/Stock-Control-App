import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Product {
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
};

export default api;
