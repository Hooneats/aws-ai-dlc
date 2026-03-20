import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from './seed.service';
import { Store } from '../store/entities/store.entity';
import { Admin } from '../auth/entities/admin.entity';
import { Category } from '../category/entities/category.entity';

describe('SeedService', () => {
  let service: SeedService;
  let storeRepo: jest.Mocked<Partial<Repository<Store>>>;
  let adminRepo: jest.Mocked<Partial<Repository<Admin>>>;
  let categoryRepo: jest.Mocked<Partial<Repository<Category>>>;

  beforeEach(async () => {
    storeRepo = { findOne: jest.fn(), save: jest.fn() };
    adminRepo = { findOne: jest.fn(), save: jest.fn() };
    categoryRepo = { findOne: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(Store), useValue: storeRepo },
        { provide: getRepositoryToken(Admin), useValue: adminRepo },
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
      ],
    }).compile();
    service = module.get(SeedService);
  });

  // TC-BE-042: Seed 데이터 생성 (멱등성)
  it('should create seed data when DB is empty', async () => {
    storeRepo.findOne!.mockResolvedValue(null);
    adminRepo.findOne!.mockResolvedValue(null);
    categoryRepo.findOne!.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    storeRepo.save!.mockResolvedValue({ id: 1, code: 'store01', name: '우리매장' } as Store);
    adminRepo.save!.mockResolvedValue({} as Admin);
    categoryRepo.save!.mockResolvedValue({} as Category);

    await service.seed();

    expect(storeRepo.save).toHaveBeenCalledWith(expect.objectContaining({ code: 'store01', name: '우리매장' }));
    expect(adminRepo.save).toHaveBeenCalled();
    expect(categoryRepo.save).toHaveBeenCalledTimes(2);
  });

  it('should skip seed when data already exists (idempotent)', async () => {
    storeRepo.findOne!.mockResolvedValue({ id: 1, code: 'store01' } as Store);

    await service.seed();

    expect(storeRepo.save).not.toHaveBeenCalled();
    expect(adminRepo.save).not.toHaveBeenCalled();
  });
});
