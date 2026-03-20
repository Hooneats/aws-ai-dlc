import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

describe('StoreService', () => {
  let service: StoreService;
  let repo: jest.Mocked<Partial<Repository<Store>>>;

  beforeEach(async () => {
    repo = { findOne: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService, { provide: getRepositoryToken(Store), useValue: repo }],
    }).compile();
    service = module.get(StoreService);
  });

  it('should return the store', async () => {
    const store = { id: 1, code: 'store01', name: '우리매장' } as Store;
    repo.findOne!.mockResolvedValue(store);
    const result = await service.getStore();
    expect(result).toEqual(store);
  });

  it('should throw if no store found', async () => {
    repo.findOne!.mockResolvedValue(null);
    await expect(service.getStore()).rejects.toThrow();
  });
});
