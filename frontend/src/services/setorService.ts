import api from './api';

/* =========================
   TIPOS
========================= */

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

export type SetorPayload = Omit<Setor, 'id'>;

export interface HistoricoSetor {
  id_produto: number;
  tipo: string; // 'entrada' | 'saida'
  quantidade: number;
  setor: string;
  timestamp: string;
}

/* =========================
   SERVICE
========================= */

export const setorService = {
  /* 🔹 SETORES */
  getAll: async (): Promise<Setor[]> => {
    const response = await api.get('/setores');
    return response.data;
  },

  createSetor: async (setor: SetorPayload): Promise<Setor> => {
    const response = await api.post('/setores', setor);
    return response.data;
  },

  updateSetor: async (
    id: number,
    setor: SetorPayload
  ): Promise<Setor> => {
    const response = await api.put(`/setores/${id}`, setor);
    return response.data;
  },
  getHistorico: async (): Promise<HistoricoSetor[]> => {
    const response = await api.get('/setores/');
    return response.data;
  },
};
