import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { Menu } from '../menu/entities/menu.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: jest.Mocked<Partial<Repository<Category>>>;
  let menuRepo: jest.Mocked<Partial<Repository<Menu>>>;

  beforeEach(async () => {
    repo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn(), delete: jest.fn() };
    menuRepo = { find: jest.fn(), update: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getRepositoryToken(Category), useValue: repo },
        { provide: getRepositoryToken(Menu), useValue: menuRepo },
      ],
    }).compile();
    service = module.get(CategoryService);
  });

  // TC-BE-006
  it('should create category', async () => {
    repo.save!.mockResolvedValue({ id: 1, storeId: 1, name: '한식', sortOrder: 1 } as Category);
    const result = await service.create(1, '한식', 1);
    expect(result.name).toBe('한식');
  });

  // TC-BE-007
  it('should reject deleting default category', async () => {
    repo.findOne!.mockResolvedValue({ id: 1, isDefault: true, isServiceCategory: false } as Category);
    await expect(service.delete(1)).rejects.toThrow(BadRequestException);
  });

  // TC-BE-008
  it('should reject deleting service category', async () => {
    repo.findOne!.mockResolvedValue({ id: 2, isDefault: false, isServiceCategory: true } as Category);
    await expect(service.delete(2)).rejects.toThrow(BadRequestException);
  });

  // TC-BE-009
  it('should move menus to default category on delete', async () => {
    repo.findOne!.mockImplementation(async (opts: any) => {
      if (opts?.where?.id === 3) return { id: 3, storeId: 1, isDefault: false, isServiceCategory: false } as Category;
      if (opts?.where?.isDefault === true) return { id: 99, storeId: 1, isDefault: true } as Category;
      return null;
    });
    menuRepo.find!.mockResolvedValue([{ id: 10 }, { id: 11 }] as Menu[]);
    menuRepo.update!.mockResolvedValue({} as any);
    repo.delete!.mockResolvedValue({} as any);

    await service.delete(3);
    expect(menuRepo.update).toHaveBeenCalledWith({ categoryId: 3 }, { categoryId: 99 });
    expect(repo.delete).toHaveBeenCalledWith(3);
  });

  // TC-BE-010
  it('should return only visible categories for customers', async () => {
    repo.find!.mockResolvedValue([
      { id: 1, name: '한식', isHidden: false },
      { id: 2, name: '양식', isHidden: false },
    ] as Category[]);
    const result = await service.findAll(1, false);
    expect(result).toHaveLength(2);
  });
});
