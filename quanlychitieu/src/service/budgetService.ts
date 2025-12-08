import axiosClient from './axiosClient';

export const budgetService = {
  get(month: number, year: number) {
    return axiosClient.get(`/budgets?month=${month}&year=${year}`);
  },
  set(month: number, year: number, limit: number) {
    return axiosClient.post('/budgets', { month, year, limit });
  }
};