import api from './axios';
import type { TableEntity, OrderHistory } from '@/types';

export const getTables = () =>
  api.get<TableEntity[]>('/tables').then((r) => r.data);

export const createTable = (tableNo: number) =>
  api.post<TableEntity>('/tables', { tableNo }).then((r) => r.data);

export const deleteTable = (id: number) => api.delete(`/tables/${id}`);

export const setupTable = (id: number) => api.post(`/tables/${id}/setup`);

export const settleTable = (id: number) => api.post(`/tables/${id}/settle`);

export const getTableHistory = (id: number, date?: string) =>
  api.get<OrderHistory[]>(`/tables/${id}/history`, { params: { date } }).then((r) => r.data);
