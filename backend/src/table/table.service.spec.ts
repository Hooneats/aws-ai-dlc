import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TableService } from './table.service';
import { TableEntity } from './entities/table.entity';
import { OrderHistory } from '../order/entities/order-history.entity';
import { OrderService } from '../order/order.service';
import { ServiceCallService } from '../service-call/service-call.service';
import { SseService } from '../sse/sse.service';

describe('TableService', () => {
  let service: TableService;
  let repo: jest.Mocked<Partial<Repository<TableEntity>>>;

  beforeEach(async () => {
    repo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn(), delete: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        { provide: getRepositoryToken(TableEntity), useValue: repo },
        { provide: getRepositoryToken(OrderHistory), useValue: { find: jest.fn() } },
        { provide: OrderService, useValue: {} },
        { provide: ServiceCallService, useValue: {} },
        { provide: SseService, useValue: {} },
      ],
    }).compile();
    service = module.get(TableService);
  });

  // TC-BE-029
  it('should create table', async () => {
    repo.findOne!.mockResolvedValue(null);
    repo.save!.mockResolvedValue({ id: 1, storeId: 1, tableNo: 1 } as TableEntity);
    const result = await service.create(1, 1);
    expect(result.tableNo).toBe(1);
  });

  // TC-BE-030
  it('should reject duplicate table number', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, storeId: 1, tableNo: 1 } as TableEntity);
    await expect(service.create(1, 1)).rejects.toThrow(ConflictException);
  });

  // TC-BE-031
  it('should reject deleting table with active session', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, sessionId: 'active-session' } as TableEntity);
    await expect(service.delete(1)).rejects.toThrow(BadRequestException);
  });

  it('should delete table without session', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, sessionId: null } as TableEntity);
    repo.delete!.mockResolvedValue({} as any);
    await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should setup table with new session', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, sessionId: null } as TableEntity);
    repo.save!.mockImplementation(async (e: any) => e);
    const result = await service.setup(1);
    expect(result.sessionId).toBeDefined();
  });
});
