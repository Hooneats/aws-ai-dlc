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

  async getTodayDashboard(storeId: number): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const histories = await this.historyRepo.find({ where: { settledAt: Between(today, tomorrow) }, relations: ['items'] });
    const activeOrders = await this.orderRepo.find({ where: { status: 'COMPLETED' as any, createdAt: Between(today, tomorrow) }, relations: ['items'] });
    const activeTables = await this.tableRepo.count({ where: { sessionId: Not(IsNull()) } });

    const historySales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const activeOrderSales = activeOrders.reduce((s, o) => s + o.totalAmount, 0);
    const totalSales = historySales + activeOrderSales;
    const historyOrderCount = histories.reduce((s, h) => s + h.orderCount, 0);
    const totalOrders = historyOrderCount + activeOrders.length;

    return { totalSales, totalOrders, activeTables, avgPerTable: activeTables > 0 ? Math.floor(totalSales / activeTables) : 0 };
  }

  async getDailySummary(storeId: number, date: string): Promise<any> {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) } });
    const totalSales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const totalOrders = histories.reduce((s, h) => s + h.orderCount, 0);
    return { totalSales, totalOrders };
  }

  async getByTable(storeId: number, date: string): Promise<any> {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) } });
    const map = new Map<number, { tableId: number; totalSales: number; orderCount: number }>();
    for (const h of histories) {
      const e = map.get(h.tableId) || { tableId: h.tableId, totalSales: 0, orderCount: 0 };
      e.totalSales += h.totalAmount;
      e.orderCount += h.orderCount;
      map.set(h.tableId, e);
    }
    return Array.from(map.values());
  }

  async getByMenu(storeId: number, date: string): Promise<any> {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(d, next) }, relations: ['items'] });
    const map = new Map<string, { menuName: string; quantity: number; sales: number }>();
    for (const h of histories) {
      for (const hi of h.items || []) {
        for (const item of hi.items || []) {
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
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 365) throw new BadRequestException('조회 기간은 최대 1년입니다.');

    end.setDate(end.getDate() + 1);
    const histories = await this.historyRepo.find({ where: { settledAt: Between(start, end) }, relations: ['items'] });
    const totalSales = histories.reduce((s, h) => s + h.totalAmount, 0);
    const totalOrders = histories.reduce((s, h) => s + h.orderCount, 0);
    return { totalSales, totalOrders, avgDailySales: diffDays > 0 ? Math.floor(totalSales / diffDays) : 0, days: diffDays };
  }
}
