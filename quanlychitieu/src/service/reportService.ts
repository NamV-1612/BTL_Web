import axiosClient from './axiosClient';

export const reportService = {
  getMonthly(month: number, year: number) {
    return axiosClient.get(`/reports/monthly?month=${month}&year=${year}`);
  },
  getAnnual(year: number) {
    return axiosClient.get(`/reports/annual?year=${year}`);
  }
};