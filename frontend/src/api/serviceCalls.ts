import api from './axios';
import type { ServiceCall } from '@/types';

export const createServiceCall = (menuId: number) =>
  api.post<ServiceCall>('/service-calls', { menuId }).then((r) => r.data);

export const getPendingServiceCalls = () =>
  api.get<ServiceCall[]>('/service-calls/pending').then((r) => r.data);

export const confirmServiceCall = (id: number) => api.patch(`/service-calls/${id}/confirm`);

export const completeServiceCall = (id: number) => api.patch(`/service-calls/${id}/complete`);
