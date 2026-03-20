import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TableService } from './table.service';
import { TableEntity } from './entities/table.entity';
import { OrderService } from '../order/order.service';
import { ServiceCallService } from '../service-call/service-call.service';
import { SseService } from '../sse/sse.service';
import { OrderHistory } from '../order/entities/order-history.entity';

describe('TableService.settle', () => {
  let service: TableService;
  let repo: jest.Mocked<Partial<Repository<TableEntity>>>;
  let historyRepo: jest.Mocked<Partial<Repository<OrderHistory>>>;
  let orderService: jest.Mocked<Partial<OrderService>>;
  let serviceCallService: jest.Mocked<Partial<ServiceCallService>>;
  let sseService: jest.Mocked<Partial<SseService>>;

  beforeEach(async () => {
    repo = { findOne: jest.fn(), save: jest.fn(), find: jest.fn(), delete: jest.fn() };
    historyRepo = { find: jest.fn() };
    orderService = { findByTable: jest.fn(), moveToHistory: jest.fn() };
    serviceCallService = { clearByTable: jest.fn() };
    sseService = { emitSessionEnd: jest.fn(), clearBuffer: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        { provide: getRepositoryToken(TableEntity), useValue: repo },
        { provide: getRepositoryToken(OrderHistory), useValue: historyRepo },
        { provide: OrderService, useValue: orderService },
        { provide: ServiceCallService, useValue: serviceCallService },
        { provide: SseService, useValue: sseService },
      ],
    }).compile();
    service = module.get(TableService);
  });

  // TC-BE-032
  it('should settle when all orders completed/cancelled', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, sessionId: 'sess-1', storeId: 1 } as TableEntity);
    orderService.findByTable!.mockResolvedValue([
      { id: 1, status: 'COMPLETED' },
      { id: 2, status: 'COMPLETED' },
      { id: 3, status: 'CANCELLED' },
    ] as any);
    orderService.moveToHistory!.mockResolvedValue(undefined);
    serviceCallService.clearByTable!.mockResolvedValue(undefined);
    repo.save!.mockImplementation(async (e: any) => e);

    await service.settle(1);
    expect(orderService.moveToHistory).toHaveBeenCalledWith('sess-1');
    expect(serviceCallService.clearByTable).toHaveBeenCalledWith(1);
    expect(sseService.emitSessionEnd).toHaveBeenCalledWith(1);
    expect(sseService.clearBuffer).toHaveBeenCalledWith('table-1');
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ sessionId: null }));
  });

  // TC-BE-033
  it('should reject settle with pending orders', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, sessionId: 'sess-1' } as TableEntity);
    orderService.findByTable!.mockResolvedValue([
      { id: 1, status: 'COMPLETED' },
      { id: 2, status: 'PENDING', items: [], totalAmount: 5000 },
    ] as any);

    await expect(service.settle(1)).rejects.toThrow(BadRequestException);
  });

  it('should get history for table', async () => {
    historyRepo.find!.mockResolvedValue([{ id: 1, tableId: 1 }] as any);
    const result = await service.getHistory(1);
    expect(result).toHaveLength(1);
  });
});
