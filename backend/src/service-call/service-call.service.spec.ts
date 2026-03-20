import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceCallService } from './service-call.service';
import { ServiceCall } from './entities/service-call.entity';
import { MenuService } from '../menu/menu.service';
import { SseService } from '../sse/sse.service';

describe('ServiceCallService', () => {
  let service: ServiceCallService;
  let repo: jest.Mocked<Partial<Repository<ServiceCall>>>;
  let menuService: jest.Mocked<Partial<MenuService>>;
  let sseService: jest.Mocked<Partial<SseService>>;

  beforeEach(async () => {
    repo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn(), delete: jest.fn() };
    menuService = { findByIds: jest.fn() };
    sseService = { emitServiceCall: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCallService,
        { provide: getRepositoryToken(ServiceCall), useValue: repo },
        { provide: MenuService, useValue: menuService },
        { provide: SseService, useValue: sseService },
      ],
    }).compile();
    service = module.get(ServiceCallService);
  });

  // TC-BE-034
  it('should create service call for service category menu', async () => {
    menuService.findByIds!.mockResolvedValue([{ id: 1, name: '물', isActive: true, category: { isServiceCategory: true } }] as any);
    repo.save!.mockImplementation(async (e: any) => ({ id: 1, ...e }));

    const result = await service.create(5, 1);
    expect(result.menuName).toBe('물');
    expect(sseService.emitServiceCall).toHaveBeenCalled();
  });

  // TC-BE-035
  it('should reject non-service category menu', async () => {
    menuService.findByIds!.mockResolvedValue([{ id: 1, name: '김치찌개', isActive: true, category: { isServiceCategory: false } }] as any);
    await expect(service.create(5, 1)).rejects.toThrow(BadRequestException);
  });

  it('should confirm service call', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, status: 'PENDING' } as ServiceCall);
    repo.save!.mockImplementation(async (e: any) => e);
    const result = await service.confirm(1);
    expect(result.status).toBe('CONFIRMED');
  });

  it('should complete service call', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, status: 'CONFIRMED' } as ServiceCall);
    repo.save!.mockImplementation(async (e: any) => e);
    const result = await service.complete(1);
    expect(result.status).toBe('COMPLETED');
  });

  it('should clear by table', async () => {
    repo.delete!.mockResolvedValue({} as any);
    await service.clearByTable(5);
    expect(repo.delete).toHaveBeenCalledWith({ tableId: 5 });
  });
});
