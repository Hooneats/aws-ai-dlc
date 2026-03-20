import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TableEntity } from './entities/table.entity';
import { OrderHistory } from '../order/entities/order-history.entity';
import { OrderService } from '../order/order.service';
import { ServiceCallService } from '../service-call/service-call.service';
import { SseService } from '../sse/sse.service';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(TableEntity) private readonly repo: Repository<TableEntity>,
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    private readonly orderService: OrderService,
    private readonly serviceCallService: ServiceCallService,
    private readonly sseService: SseService,
  ) {}

  async create(storeId: number, tableNo: number): Promise<TableEntity> {
    const existing = await this.repo.findOne({ where: { storeId, tableNo } });
    if (existing) throw new ConflictException('이미 존재하는 테이블 번호입니다.');
    return this.repo.save({ storeId, tableNo });
  }

  async delete(tableId: number): Promise<void> {
    const table = await this.repo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');
    if (table.sessionId) throw new BadRequestException('활성 세션이 있는 테이블은 삭제할 수 없습니다.');
    await this.repo.delete(tableId);
  }

  async findAll(storeId: number): Promise<TableEntity[]> {
    return this.repo.find({ where: { storeId }, order: { tableNo: 'ASC' } });
  }

  async setup(tableId: number): Promise<{ sessionId: string }> {
    const table = await this.repo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');
    const sessionId = uuidv4();
    table.sessionId = sessionId;
    table.sessionStartedAt = new Date();
    await this.repo.save(table);
    return { sessionId };
  }

  async settle(tableId: number): Promise<void> {
    const table = await this.repo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');
    if (!table.sessionId) throw new BadRequestException('활성 세션이 없습니다.');

    const orders = await this.orderService.findByTable(tableId);
    const pending = orders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING');
    if (pending.length > 0) {
      throw new BadRequestException({
        message: '미완료 주문이 있습니다. 완료 또는 취소 처리 후 정산해주세요.',
        error: 'UNSETTLED_ORDERS',
        pendingOrders: pending.map((o) => ({ orderId: o.id, status: o.status, totalAmount: o.totalAmount })),
      });
    }

    await this.orderService.moveToHistory(table.sessionId);
    await this.serviceCallService.clearByTable(tableId);
    table.sessionId = null;
    table.sessionStartedAt = null;
    await this.repo.save(table);
    this.sseService.emitSessionEnd(tableId);
    this.sseService.clearBuffer(`table-${tableId}`);
  }

  async getHistory(tableId: number, date?: string): Promise<OrderHistory[]> {
    const where: any = { tableId };
    return this.historyRepo.find({ where, relations: ['items'], order: { settledAt: 'DESC' } });
  }
}
