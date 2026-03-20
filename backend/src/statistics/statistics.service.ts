import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { OrderHistory } from '../order/entities/order-history.entity';
import { OrderHistoryItem } from '../order/entities/order-history-item.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { TableEntity } from '../table/entities/table.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    @InjectRepository(OrderHistoryItem) private readonly historyItemRepo: Repository<OrderHistoryItem>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(TableEntity) private readonly tableRepo: Repository<TableEntity>,
  ) {}

  private dayRange(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return { d, next };
  }

  async getTodayDashboard(storeId: number): Promise<any> {
    const { d: today, next: tomorrow } = this.dayRange(new Date());

    const histories = await this.historyRepo.find({ where: { settledAt: Between(today, tomorrow) }, relations: ['items'] });
    const activeOrders = await this.orderRepo.find({ where: { status: 'COMPLETED' as any, createdAt: Between(today, tomorrow) }, relations: ['items'] });
    const activeTables = await this.tableRepo.count({ where: { sessionId: Not(IsNull()) } });
    const totalTables = await this.tableRepo.count();

    const historySales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const activeOrderSales = activeOrders.reduce((s, o) => s + o.totalAmount, 0);
    const sales = historySales + activeOrderSales;
    const historyOrderCount = histories.reduce((s, h) => s + h.orderCount, 0);
    const orders = historyOrderCount + activeOrders.length;

    // topMenus 집계
    const menuMap = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items || []) {
        for (const item of (hi as any).items || []) {
          const e = menuMap.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
          e.quantity += item.quantity;
          e.sales += item.unitPrice * item.quantity;
          menuMap.set(item.menuName, e);
        }
      }
    }
    for (const o of activeOrders) {
      for (const item of o.items || []) {
        const e = menuMap.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
        e.quantity += item.quantity;
        e.sales += item.unitPrice * item.quantity;
        menuMap.set(item.menuName, e);
      }
    }
    const topMenus = Array.from(menuMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // hourlyStats 집계
    const hourMap = new Map<number, { hour: number; orders: number; sales: number }>();
    for (const o of activeOrders) {
      const h = new Date(o.createdAt).getHours();
      const e = hourMap.get(h) || { hour: h, orders: 0, sales: 0 };
      e.orders += 1;
      e.sales += o.totalAmount;
      hourMap.set(h, e);
    }
    const hourlyStats = Array.from(hourMap.values()).sort((a, b) => a.hour - b.hour);

    return { sales, orders, activeTables, totalTables, avgPerTable: activeTables > 0 ? Math.floor(sales / activeTables) : 0, topMenus, hourlyStats };
  }

  async getDailySummary(storeId: number, date: string): Promise<any> {
    const { d, next } = this.dayRange(new Date(date));
    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) } });
    const totalSales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const totalOrders = histories.reduce((s, h) => s + h.orderCount, 0);
    return { totalSales, totalOrders };
  }

  async getByTable(storeId: number, date: string): Promise<any> {
    const { d, next } = this.dayRange(new Date(date));
    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) }, relations: ['table'] });
    const map = new Map<number, { tableNo: number; sales: number; orders: number }>();
    for (const h of histories) {
      const tableNo = (h as any).table?.tableNo ?? h.tableId;
      const e = map.get(tableNo) || { tableNo, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      map.set(tableNo, e);
    }
    return Array.from(map.values());
  }

  async getByMenu(storeId: number, date: string): Promise<any> {
    const { d, next } = this.dayRange(new Date(date));
    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) }, relations: ['items'] });
    const map = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items || []) {
        for (const item of (hi as any).items || []) {
          const e = map.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
          e.quantity += item.quantity;
          e.sales += item.unitPrice * item.quantity;
          map.set(item.menuName, e);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }

  async getPeriodSummary(storeId: number, startDate: string, endDate: string): Promise<any> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    if (diffDays > 365) throw new BadRequestException('조회 기간은 최대 1년입니다.');

    const endNext = new Date(end);
    endNext.setDate(endNext.getDate() + 1);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, endNext) }, relations: ['items', 'table'] });

    const totalSales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const totalOrders = histories.reduce((s, h) => s + h.orderCount, 0);

    // dailyTrend
    const dayMap = new Map<string, { date: string; sales: number; orders: number }>();
    for (const h of histories) {
      const dateStr = new Date(h.settledAt).toISOString().slice(0, 10);
      const e = dayMap.get(dateStr) || { date: dateStr, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      dayMap.set(dateStr, e);
    }
    const dailyTrend = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // menuRanking
    const menuMap = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items || []) {
        for (const item of (hi as any).items || []) {
          const e = menuMap.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
          e.quantity += item.quantity;
          e.sales += item.unitPrice * item.quantity;
          menuMap.set(item.menuName, e);
        }
      }
    }
    const menuRanking = Array.from(menuMap.values()).sort((a, b) => b.sales - a.sales);

    // tableRanking
    const tableMap = new Map<number, { tableNo: number; sales: number; orders: number }>();
    for (const h of histories) {
      const tableNo = (h as any).table?.tableNo ?? h.tableId;
      const e = tableMap.get(tableNo) || { tableNo, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      tableMap.set(tableNo, e);
    }
    const tableRanking = Array.from(tableMap.values()).sort((a, b) => b.sales - a.sales);

    // dayOfWeekPattern
    const dowNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dowMap = new Map<number, { count: number; totalSales: number; totalOrders: number }>();
    for (const [, v] of dayMap) {
      const dow = new Date(v.date).getDay();
      const e = dowMap.get(dow) || { count: 0, totalSales: 0, totalOrders: 0 };
      e.count += 1;
      e.totalSales += v.sales;
      e.totalOrders += v.orders;
      dowMap.set(dow, e);
    }
    const dayOfWeekPattern = dowNames.map((day, i) => {
      const e = dowMap.get(i);
      return { day, avgSales: e ? Math.floor(e.totalSales / e.count) : 0, avgOrders: e ? Math.floor(e.totalOrders / e.count) : 0 };
    });

    return { totalSales, totalOrders, avgDailySales: Math.floor(totalSales / diffDays), dailyTrend, menuRanking, tableRanking, dayOfWeekPattern };
  }
}
