import api from './axios';
import type { LoginResponse, TableLoginResponse, AdminLoginForm } from '@/types';

export const adminLogin = (data: AdminLoginForm) =>
  api.post<LoginResponse>('/auth/admin/login', data).then((r) => r.data);

export const tableLogin = (storeCode: string, tableNo: number) =>
  api.post<TableLoginResponse>('/auth/table/login', { storeCode, tableNo }).then((r) => r.data);
