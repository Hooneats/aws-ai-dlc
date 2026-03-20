import api from './axios';
import type { Order, CreateOrderRequest, OrderStatus } from '@/types';

export const createOrder = (data: CreateOrderRequest) =>
  api.post<Order>('/orders', data).then((r) => r.data);

export const getOrdersBySession = (sessionId: string) =>
  api.get<Order[]>(`/orders/session/${sessionId}`).then((r) => r.data);

export const getOrdersByTable = (tableId: number, date?: string) =>
  api.get<Order[]>(`/orders/table/${tableId}`, { params: { date } }).then((r) => r.data);

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  api.patch(`/orders/${id}/status`, { status });

export const cancelOrder = (id: number) => api.patch(`/orders/${id}/cancel`);

export const deleteOrder = (id: number) => api.delete(`/orders/${id}`);

export const deleteOrderItem = (orderId: number, itemId: number) =>
  api.delete(`/orders/${orderId}/items/${itemId}`);

export const batchUpdateStatus = (orderIds: number[], status: OrderStatus) =>
  api.patch('/orders/batch-status', { orderIds, status });
