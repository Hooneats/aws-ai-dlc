import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { OrderHistoryItem } from './entities/order-history-item.entity';
import { MenuService } from '../menu/menu.service';
import { SseService } from '../sse/sse.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PREPARING', 'CANCELLED'],
  PREPARING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    @InjectRepository(OrderHistoryItem) private readonly historyItemRepo: Repository<OrderHistoryItem>,
    private readonly menuService: MenuService,
    private readonly sseService: SseService,
  ) {}

  async create(tableId: number, sessionId: string, items: { menuId: number; quantity: number }[], memo?: string): Promise<Order> {
    const menuIds = items.map((i) => i.menuId);
    const menus = await this.menuService.findByIds(menuIds);
    const menuMap = new Map(menus.map((m) => [m.id, m]));

    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const menu = menuMap.get(item.menuId);
      if (!menu) throw new BadRequestException(`메뉴를 찾을 수 없습니다.`);
      if (!menu.isActive) throw new BadRequestException(`주문할 수 없는 메뉴입니다: ${menu.name}`);
      if (menu.isSoldOut) throw new BadRequestException(`품절된 메뉴입니다: ${menu.name}`);

      const { originalPrice, discountRate, finalPrice } = this.menuService.getDiscountedPrice(menu);
      totalAmount += finalPrice * item.quantity;
      orderItems.push({ menuId: menu.id, menuName: menu.name, quantity: item.quantity, unitPrice: finalPrice, originalPrice, discountRate });
    }

    const order = await this.orderRepo.save({ tableId, sessionId, status: 'PENDING' as const, totalAmount, memo });
    for (const oi of orderItems) { await this.itemRepo.save({ ...oi, orderId: order.id }); }

    this.sseService.emitNewOrder(order);
    return order;
  }

  async updateStatus(orderId: number, newStatus: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    if (!VALID_TRANSITIONS[order.status]?.includes(newStatus)) throw new BadRequestException('허용되지 않는 상태 변경입니다.');
    order.status = newStatus as any;
    const saved = await this.orderRepo.save(order);
    this.sseService.emitOrderStatus(orderId, newStatus, order.tableId);
    return saved;
  }

  async cancel(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    if (!VALID_TRANSITIONS[order.status]?.includes('CANCELLED')) throw new BadRequestException('취소할 수 없는 주문입니다.');
    order.status = 'CANCELLED';
    const saved = await this.orderRepo.save(order);
    this.sseService.emitOrderStatus(orderId, 'CANCELLED', order.tableId);
    return saved;
  }

  async delete(orderId: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    await this.orderRepo.delete(orderId);
    this.sseService.emitOrderDeleted(orderId, order.tableId);
  }

  async deleteItem(orderId: number, orderItemId: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    const remaining = order.items.filter((i) => i.id !== orderItemId);
    await this.itemRepo.delete(orderItemId);

    if (remaining.length === 0) {
      await this.orderRepo.delete(orderId);
      this.sseService.emitOrderDeleted(orderId, order.tableId);
    } else {
      order.totalAmount = remaining.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      order.items = remaining;
      await this.orderRepo.save(order);
      this.sseService.emitOrderUpdated(orderId, order.tableId, remaining, order.totalAmount);
    }
  }

  async findBySession(sessionId: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { sessionId, status: Not('CANCELLED') as any }, relations: ['items'], order: { createdAt: 'ASC' } });
  }

  async findByTable(tableId: number, date?: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { tableId }, relations: ['items'], order: { createdAt: 'DESC' } });
  }

  async batchUpdateStatus(orderIds: number[], status: string): Promise<void> {
    for (const id of orderIds) { await this.updateStatus(id, status); }
  }

  async moveToHistory(sessionId: string): Promise<void> {
    const orders = await this.orderRepo.find({ where: { sessionId }, relations: ['items'] });
    if (orders.length === 0) return;

    const tableId = orders[0].tableId;
    const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
    const totalAmount = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const history = await this.historyRepo.save({
      tableId, sessionId, totalAmount, orderCount: completedOrders.length,
      settledAt: new Date(), createdAt: orders[0].createdAt || new Date(),
    });

    for (const order of orders) {
      await this.historyItemRepo.save({
        historyId: history.id, orderId: order.id, status: order.status as any,
        totalAmount: order.totalAmount, memo: order.memo,
        items: order.items.map((i) => ({ menuName: i.menuName, quantity: i.quantity, unitPrice: i.unitPrice, originalPrice: i.originalPrice, discountRate: i.discountRate })),
        orderedAt: order.createdAt,
      });
    }

    for (const order of orders) { await this.orderRepo.delete(order.id); }
  }
}
