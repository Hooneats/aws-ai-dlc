import api from './axios';
import type { Category } from '@/types';

export const getCategories = (storeId: number, includeHidden = false) =>
  api.get<Category[]>('/categories', { params: { storeId, includeHidden } }).then((r) => r.data);

export const createCategory = (name: string, sortOrder: number) =>
  api.post<Category>('/categories', { name, sortOrder }).then((r) => r.data);

export const updateCategory = (id: number, data: { name?: string; sortOrder?: number }) =>
  api.patch<Category>(`/categories/${id}`, data).then((r) => r.data);

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

export const updateCategoryOrder = (ids: number[], sortOrders: number[]) =>
  api.patch('/categories/order', { ids, sortOrders });
