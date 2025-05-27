import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL do seu backend
});

export const productService = {
  // Obter todos os produtos
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // Registrar uma retirada
  registerWithdrawal: async (data: {
    id: number;
    quantidade: number;
    andar: string;
  }) => {
    try {
      const response = await api.post('/products/retirada', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar retirada:', error);
      throw error;
    }
  },

  // Atualizar produtos em lote
  updateProducts: async (products: any[]) => {
    try {
      const response = await api.put('/products', products);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produtos:', error);
      throw error;
    }
  },
};

export default api;