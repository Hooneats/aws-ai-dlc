import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { OrderHistory } from '../order/entities/order-history.entity';
import { Order } from '../order/entities/order.entity';
import { TableEntity } from '../table/entities/table.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(TableEntity) private readonly tableRepo: Repository<TableEntity>,
  ) {}

  private dayRange(date: string | Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return { start: d, end: next };
  }

  private collectMenuStats(histories: OrderHistory[]) {
    const map = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items ?? []) {
        for (const item of hi.items ?? []) {
          const e = map.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
          e.quantity += item.quantity;
          e.sales += item.unitPrice * item.quantity;
          map.set(item.menuName, e);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }

  async getTodayDashboard(storeId: number) {
    const { start, end } = this.dayRange(new Date());

    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, end) }, relations: ['items', 'table'] });
    const activeOrders = await this.orderRepo.find({ where: { status: 'COMPLETED' as any, createdAt: Between(start, end) }, relations: ['items'] });
    const totalTables = await this.tableRepo.count();
    const activeTables = await this.tableRepo.count({ where: { sessionId: Not(IsNull()) } });

    const historySales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const activeOrderSales = activeOrders.reduce((s, o) => s + o.totalAmount, 0);
    const sales = historySales + activeOrderSales;
    const orders = histories.reduce((s, h) => s + h.orderCount, 0) + activeOrders.length;

    // top menus from history + active orders
    const menuMap = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items ?? []) {
        for (const item of hi.items ?? []) {
          const e = menuMap.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
          e.quantity += item.quantity;
          e.sales += item.unitPrice * item.quantity;
          menuMap.set(item.menuName, e);
        }
      }
    }
    for (const o of activeOrders) {
      for (const item of o.items ?? []) {
        const e = menuMap.get(item.menuName) || { menuName: item.menuName, quantity: 0, sales: 0 };
        e.quantity += item.quantity;
        e.sales += item.unitPrice * item.quantity;
        menuMap.set(item.menuName, e);
      }
    }
    const topMenus = Array.from(menuMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // hourly stats
    const hourlyMap = new Map<number, { hour: number; orders: number; sales: number }>();
    for (let h = 0; h < 24; h++) hourlyMap.set(h, { hour: h, orders: 0, sales: 0 });
    for (const h of histories) {
      const hour = new Date(h.settledAt).getHours();
      const e = hourlyMap.get(hour)!;
      e.orders += h.orderCount;
      e.sales += h.totalAmount;
    }
    for (const o of activeOrders) {
      const hour = new Date(o.createdAt).getHours();
      const e = hourlyMap.get(hour)!;
      e.orders += 1;
      e.sales += o.totalAmount;
    }
    const hourlyStats = Array.from(hourlyMap.values());

    return { sales, orders, activeTables, totalTables, avgPerTable: activeTables > 0 ? Math.floor(sales / activeTables) : 0, topMenus, hourlyStats };
  }

  async getDailySummary(storeId: number, date: string) {
    const { start, end } = this.dayRange(date);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, end) } });
    const totalSales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const totalOrders = histories.reduce((s, h) => s + h.orderCount, 0);
    return { totalSales, totalOrders };
  }

  async getByTable(storeId: number, date: string) {
    const { start, end } = this.dayRange(date);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, end) }, relations: ['table'] });
    const map = new Map<number, { tableNo: number; sales: number; orders: number }>();
    for (const h of histories) {
      const tableNo = h.table?.tableNo ?? h.tableId;
      const e = map.get(tableNo) || { tableNo, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      map.set(tableNo, e);
    }
    return Array.from(map.values()).sort((a, b) => a.tableNo - b.tableNo);
  }

  async getByMenu(storeId: number, date: string) {
    const { start, end } = this.dayRange(date);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, end) }, relations: ['items'] });
    return this.collectMenuStats(histories);
  }

  async getPeriodSummary(storeId: number, startDate: string, endDate: string) {
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

    // daily trend
    const dailyMap = new Map<string, { date: string; sales: number; orders: number }>();
    for (const h of histories) {
      const d = new Date(h.settledAt).toISOString().slice(0, 10);
      const e = dailyMap.get(d) || { date: d, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      dailyMap.set(d, e);
    }
    const dailyTrend = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // menu ranking
    const menuRanking = this.collectMenuStats(histories).slice(0, 10);

    // table ranking
    const tableMap = new Map<number, { tableNo: number; sales: number; orders: number }>();
    for (const h of histories) {
      const tableNo = h.table?.tableNo ?? h.tableId;
      const e = tableMap.get(tableNo) || { tableNo, sales: 0, orders: 0 };
      e.sales += h.totalAmount;
      e.orders += h.orderCount;
      tableMap.set(tableNo, e);
    }
    const tableRanking = Array.from(tableMap.values()).sort((a, b) => b.sales - a.sales);

    // day of week pattern
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dowMap = new Map<number, { totalSales: number; totalOrders: number; count: number }>();
    for (const d of dailyTrend) {
      const dow = new Date(d.date).getDay();
      const e = dowMap.get(dow) || { totalSales: 0, totalOrders: 0, count: 0 };
      e.totalSales += d.sales;
      e.totalOrders += d.orders;
      e.count += 1;
      dowMap.set(dow, e);
    }
    const dayOfWeekPattern = dayNames.map((day, i) => {
      const e = dowMap.get(i);
      return { day, avgSales: e ? Math.floor(e.totalSales / e.count) : 0, avgOrders: e ? Math.floor(e.totalOrders / e.count) : 0 };
    });

    return { totalSales, totalOrders, avgDailySales: Math.floor(totalSales / diffDays), dailyTrend, menuRanking, tableRanking, dayOfWeekPattern };
  }
}
