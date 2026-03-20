import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { OrderHistoryItem } from './entities/order-history-item.entity';
import { MenuService } from '../menu/menu.service';
import { SseService } from '../sse/sse.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: jest.Mocked<Partial<Repository<Order>>>;
  let itemRepo: jest.Mocked<Partial<Repository<OrderItem>>>;
  let historyRepo: jest.Mocked<Partial<Repository<OrderHistory>>>;
  let historyItemRepo: jest.Mocked<Partial<Repository<OrderHistoryItem>>>;
  let menuService: jest.Mocked<Partial<MenuService>>;
  let sseService: jest.Mocked<Partial<SseService>>;

  const mockMenu = (overrides = {}) => ({
    id: 1, name: '김치찌개', price: 10000, discountRate: 0, isSoldOut: false, isActive: true,
    category: { isServiceCategory: false }, ...overrides,
  });

  beforeEach(async () => {
    orderRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn(), delete: jest.fn(), manager: { transaction: jest.fn() } as any };
    itemRepo = { save: jest.fn(), delete: jest.fn(), find: jest.fn() };
    historyRepo = { save: jest.fn() };
    historyItemRepo = { save: jest.fn() };
    menuService = { findByIds: jest.fn(), getDiscountedPrice: jest.fn() };
    sseService = { emitNewOrder: jest.fn(), emitOrderStatus: jest.fn(), emitOrderDeleted: jest.fn(), emitOrderUpdated: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: itemRepo },
        { provide: getRepositoryToken(OrderHistory), useValue: historyRepo },
        { provide: getRepositoryToken(OrderHistoryItem), useValue: historyItemRepo },
        { provide: MenuService, useValue: menuService },
        { provide: SseService, useValue: sseService },
      ],
    }).compile();
    service = module.get(OrderService);
  });

  // TC-BE-017
  it('should create order with valid items', async () => {
    menuService.findByIds!.mockResolvedValue([mockMenu()] as any);
    menuService.getDiscountedPrice!.mockReturnValue({ originalPrice: 10000, discountRate: 0, finalPrice: 10000 });
    orderRepo.save!.mockImplementation(async (e: any) => ({ id: 1, ...e }));
    itemRepo.save!.mockResolvedValue({} as any);

    const result = await service.create(1, 'session-1', [{ menuId: 1, quantity: 2 }], '덜 맵게');
    expect(result.totalAmount).toBe(20000);
    expect(result.memo).toBe('덜 맵게');
    expect(sseService.emitNewOrder).toHaveBeenCalled();
  });

  // TC-BE-018
  it('should reject order with sold out menu', async () => {
    menuService.findByIds!.mockResolvedValue([mockMenu({ isSoldOut: true })] as any);
    await expect(service.create(1, 'session-1', [{ menuId: 1, quantity: 1 }])).rejects.toThrow(BadRequestException);
  });

  // TC-BE-019
  it('should reject order with inactive menu', async () => {
    menuService.findByIds!.mockResolvedValue([mockMenu({ isActive: false })] as any);
    await expect(service.create(1, 'session-1', [{ menuId: 1, quantity: 1 }])).rejects.toThrow(BadRequestException);
  });

  // TC-BE-020
  it('should apply discount on order', async () => {
    menuService.findByIds!.mockResolvedValue([mockMenu({ discountRate: 20 })] as any);
    menuService.getDiscountedPrice!.mockReturnValue({ originalPrice: 10000, discountRate: 20, finalPrice: 8000 });
    orderRepo.save!.mockImplementation(async (e: any) => ({ id: 1, ...e }));
    itemRepo.save!.mockResolvedValue({} as any);

    const result = await service.create(1, 'session-1', [{ menuId: 1, quantity: 2 }]);
    expect(result.totalAmount).toBe(16000);
  });

  // TC-BE-021
  it('should update PENDING to PREPARING', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, status: 'PENDING', tableId: 5 } as Order);
    orderRepo.save!.mockImplementation(async (e: any) => e);
    const result = await service.updateStatus(1, 'PREPARING');
    expect(result.status).toBe('PREPARING');
    expect(sseService.emitOrderStatus).toHaveBeenCalled();
  });

  // TC-BE-022
  it('should update PREPARING to COMPLETED', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, status: 'PREPARING', tableId: 5 } as Order);
    orderRepo.save!.mockImplementation(async (e: any) => e);
    const result = await service.updateStatus(1, 'COMPLETED');
    expect(result.status).toBe('COMPLETED');
  });

  // TC-BE-023
  it('should reject COMPLETED to PREPARING', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, status: 'COMPLETED', tableId: 5 } as Order);
    await expect(service.updateStatus(1, 'PREPARING')).rejects.toThrow(BadRequestException);
  });

  // TC-BE-024
  it('should cancel PENDING order', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, status: 'PENDING', tableId: 5 } as Order);
    orderRepo.save!.mockImplementation(async (e: any) => e);
    const result = await service.cancel(1);
    expect(result.status).toBe('CANCELLED');
  });

  // TC-BE-025
  it('should reject cancelling COMPLETED order', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, status: 'COMPLETED', tableId: 5 } as Order);
    await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
  });

  // TC-BE-026
  it('should delete item and recalculate total', async () => {
    const items = [
      { id: 10, unitPrice: 9000, quantity: 2 },
      { id: 11, unitPrice: 5000, quantity: 1 },
    ];
    orderRepo.findOne!.mockResolvedValue({ id: 1, tableId: 5, items } as any);
    itemRepo.delete!.mockResolvedValue({} as any);
    orderRepo.save!.mockImplementation(async (e: any) => e);

    await service.deleteItem(1, 11);
    expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ totalAmount: 18000 }));
    expect(sseService.emitOrderUpdated).toHaveBeenCalled();
  });

  // TC-BE-027
  it('should delete order when last item removed', async () => {
    orderRepo.findOne!.mockResolvedValue({ id: 1, tableId: 5, items: [{ id: 10, unitPrice: 5000, quantity: 1 }] } as any);
    itemRepo.delete!.mockResolvedValue({} as any);
    orderRepo.delete!.mockResolvedValue({} as any);

    await service.deleteItem(1, 10);
    expect(orderRepo.delete).toHaveBeenCalledWith(1);
    expect(sseService.emitOrderDeleted).toHaveBeenCalled();
  });

  // TC-BE-028
  it('should exclude CANCELLED orders from session query', async () => {
    orderRepo.find!.mockResolvedValue([
      { id: 1, status: 'COMPLETED' },
    ] as Order[]);
    const result = await service.findBySession('session-1');
    expect(result).toHaveLength(1);
  });
});
