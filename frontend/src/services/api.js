import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getPedidos = () => api.get('/pedidos/');
export const createPedido = (pedido) => api.post('/pedidos/', pedido);

export default api;
