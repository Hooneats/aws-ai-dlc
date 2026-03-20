import api from './axios';
import type { Menu, CreateMenuForm } from '@/types';

export const getMenus = (storeId: number, categoryId?: number) =>
  api.get<Menu[]>('/menus', { params: { storeId, categoryId, activeOnly: true } }).then((r) => r.data);

export const getAllMenus = (storeId: number, categoryId?: number) =>
  api.get<Menu[]>('/menus', { params: { storeId, categoryId, activeOnly: false } }).then((r) => r.data);

export const getRecommended = (storeId: number) =>
  api.get<Menu[]>('/menus/recommended', { params: { storeId } }).then((r) => r.data);

export const createMenu = (data: CreateMenuForm) =>
  api.post<Menu>('/menus', data).then((r) => r.data);

export const updateMenu = (id: number, data: Partial<CreateMenuForm>) =>
  api.patch<Menu>(`/menus/${id}`, data).then((r) => r.data);

export const deleteMenu = (id: number) => api.delete(`/menus/${id}`);

export const setRecommended = (id: number, isRecommended: boolean) =>
  api.patch(`/menus/${id}/recommended`, { isRecommended });

export const setDiscount = (id: number, discountRate: number) =>
  api.patch(`/menus/${id}/discount`, { discountRate });

export const setSoldOut = (id: number, isSoldOut: boolean) =>
  api.patch(`/menus/${id}/sold-out`, { isSoldOut });

export const updateMenuOrder = (ids: number[], sortOrders: number[]) =>
  api.patch('/menus/order', { ids, sortOrders });
