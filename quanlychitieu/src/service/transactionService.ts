import axiosClient from './axiosClient';

export const transactionService = {
  getAll() {
    return axiosClient.get('/transactions');
  },
  create(data: any) {
    return axiosClient.post('/transactions', data);
  },
  update(id: number, data: any) {
    return axiosClient.put(`/transactions/${id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`/transactions/${id}`);
  }
};