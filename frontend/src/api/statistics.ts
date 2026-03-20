import api from './axios';
import type { TodayDashboard, DailySummary, TableStat, MenuStat, PeriodSummary } from '@/types';

export const getTodayDashboard = () =>
  api.get<TodayDashboard>('/statistics/dashboard').then((r) => r.data);

export const getDailySummary = (date: string) =>
  api.get<DailySummary>('/statistics/daily', { params: { date } }).then((r) => r.data);

export const getDailyByTable = (date: string) =>
  api.get<TableStat[]>('/statistics/daily/tables', { params: { date } }).then((r) => r.data);

export const getDailyByMenu = (date: string) =>
  api.get<MenuStat[]>('/statistics/daily/menus', { params: { date } }).then((r) => r.data);

export const getPeriodSummary = (startDate: string, endDate: string) =>
  api.get<PeriodSummary>('/statistics/period', { params: { startDate, endDate } }).then((r) => r.data);
