import axiosClient from './axiosClient';

export const categoryService = {
  getAll() {
    return axiosClient.get('/categories');
  },
  create(data: { name: string; limit: number }) {
    return axiosClient.post('/categories', data);
  },
  update(id: number, data: { name: string; limit: number }) {
    return axiosClient.put(`/categories/${id}`, data);
  },
  delete(id: number) {
    return axiosClient.delete(`/categories/${id}`);
  }
};