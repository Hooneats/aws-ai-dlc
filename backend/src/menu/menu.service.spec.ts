import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MenuService } from './menu.service';
import { Menu } from './entities/menu.entity';

describe('MenuService', () => {
  let service: MenuService;
  let repo: jest.Mocked<Partial<Repository<Menu>>>;

  const mockMenu = (overrides: Partial<Menu> = {}): Menu => ({
    id: 1, storeId: 1, categoryId: 1, name: '김치찌개', price: 10000, description: null,
    imageUrl: null, sortOrder: 0, isRecommended: false, discountRate: 0, isSoldOut: false,
    isActive: true, createdAt: new Date(), updatedAt: new Date(), store: {} as any, category: {} as any,
    ...overrides,
  });

  beforeEach(async () => {
    repo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn(), update: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuService, { provide: getRepositoryToken(Menu), useValue: repo }],
    }).compile();
    service = module.get(MenuService);
  });

  // TC-BE-011
  it('should create menu', async () => {
    repo.save!.mockResolvedValue(mockMenu());
    const result = await service.create(1, '김치찌개', 10000, null, 1);
    expect(result.isActive).toBe(true);
  });

  // TC-BE-012
  it('should soft delete menu', async () => {
    repo.findOne!.mockResolvedValue(mockMenu());
    repo.save!.mockImplementation(async (e: any) => e);
    await service.delete(1);
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
  });

  // TC-BE-013
  it('should set valid discount rate', async () => {
    repo.findOne!.mockResolvedValue(mockMenu());
    repo.save!.mockImplementation(async (e: any) => e);
    const result = await service.setDiscount(1, 20);
    expect(result.discountRate).toBe(20);
  });

  // TC-BE-014
  it('should reject discount rate >= 100', async () => {
    repo.findOne!.mockResolvedValue(mockMenu());
    await expect(service.setDiscount(1, 100)).rejects.toThrow(BadRequestException);
  });

  // TC-BE-015
  it('should calculate discounted price correctly', () => {
    const menu = mockMenu({ price: 10000, discountRate: 15 });
    const result = service.getDiscountedPrice(menu);
    expect(result).toEqual({ originalPrice: 10000, discountRate: 15, finalPrice: 8500 });
  });

  // TC-BE-016
  it('should return original price when no discount', () => {
    const menu = mockMenu({ price: 10000, discountRate: 0 });
    const result = service.getDiscountedPrice(menu);
    expect(result).toEqual({ originalPrice: 10000, discountRate: 0, finalPrice: 10000 });
  });

  it('should find recommended menus', async () => {
    repo.find!.mockResolvedValue([mockMenu({ isRecommended: true })]);
    const result = await service.findRecommended(1);
    expect(result).toHaveLength(1);
  });

  it('should set sold out', async () => {
    repo.findOne!.mockResolvedValue(mockMenu());
    repo.save!.mockImplementation(async (e: any) => e);
    const result = await service.setSoldOut(1, true);
    expect(result.isSoldOut).toBe(true);
  });
});
