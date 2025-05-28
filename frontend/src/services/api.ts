import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipagens
interface Product {
  id: number;
  nome: string;
  estoque_atual: number;
  data_entrada?: string;
  data_saida?: string;
  destinatario?: string;
  quantidade?: number;
}

interface WithdrawalData {
  id: number;
  quantidade: number;
  andar: string;
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

  registerWithdrawal: async (data: WithdrawalData): Promise<Product> => {
    const response = await api.post('/products/retirada', data);
    return response.data;
  },

  updateProducts: async (products: Product[]): Promise<Product[]> => {
    const response = await api.put('/products', products);
    return response.data;
  },
};

export default api;
