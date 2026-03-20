import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StatisticsService } from './statistics.service';
import { OrderHistory } from '../order/entities/order-history.entity';
import { OrderHistoryItem } from '../order/entities/order-history-item.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { TableEntity } from '../table/entities/table.entity';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let historyRepo: any;
  let historyItemRepo: any;
  let orderRepo: any;
  let orderItemRepo: any;
  let tableRepo: any;

  beforeEach(async () => {
    historyRepo = { find: jest.fn(), createQueryBuilder: jest.fn() };
    historyItemRepo = { find: jest.fn() };
    orderRepo = { find: jest.fn(), createQueryBuilder: jest.fn() };
    orderItemRepo = { find: jest.fn() };
    tableRepo = { count: jest.fn(), find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getRepositoryToken(OrderHistory), useValue: historyRepo },
        { provide: getRepositoryToken(OrderHistoryItem), useValue: historyItemRepo },
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: orderItemRepo },
        { provide: getRepositoryToken(TableEntity), useValue: tableRepo },
      ],
    }).compile();
    service = module.get(StatisticsService);
  });

  // TC-BE-038
  it('should calculate today dashboard correctly', async () => {
    historyRepo.find.mockResolvedValue([
      { totalAmount: 50000, orderCount: 5, items: [{ items: [{ menuName: '김치찌개', quantity: 3 }] }] },
    ]);
    orderRepo.find.mockResolvedValue([
      { totalAmount: 30000, status: 'COMPLETED', items: [{ menuName: '된장찌개', quantity: 2 }] },
    ]);
    tableRepo.count.mockResolvedValue(3);
    tableRepo.find.mockResolvedValue([{}, {}, {}]);

    const result = await service.getTodayDashboard(1);
    expect(result.totalSales).toBe(80000);
    expect(result.activeTables).toBe(3);
  });

  // TC-BE-039
  it('should reject period exceeding 365 days', async () => {
    await expect(service.getPeriodSummary(1, '2025-01-01', '2026-02-01')).rejects.toThrow(BadRequestException);
  });

  it('should return daily summary', async () => {
    historyRepo.find.mockResolvedValue([{ totalAmount: 100000, orderCount: 10 }]);
    const result = await service.getDailySummary(1, '2026-03-20');
    expect(result.totalSales).toBe(100000);
  });
});
