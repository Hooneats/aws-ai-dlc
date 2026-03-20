import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Admin } from './entities/admin.entity';
import { TableEntity } from '../table/entities/table.entity';
import { StoreService } from '../store/store.service';

describe('AuthService', () => {
  let service: AuthService;
  let adminRepo: jest.Mocked<Partial<Repository<Admin>>>;
  let tableRepo: jest.Mocked<Partial<Repository<TableEntity>>>;
  let storeService: jest.Mocked<Partial<StoreService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  const mockStore = { id: 1, code: 'store01', name: '우리매장' };

  beforeEach(async () => {
    adminRepo = { findOne: jest.fn() };
    tableRepo = { findOne: jest.fn(), save: jest.fn() };
    storeService = { getStore: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('mock-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Admin), useValue: adminRepo },
        { provide: getRepositoryToken(TableEntity), useValue: tableRepo },
        { provide: StoreService, useValue: storeService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  // TC-BE-001
  it('should login admin with valid credentials', async () => {
    storeService.getStore!.mockResolvedValue(mockStore as any);
    const hashed = await bcrypt.hash('admin1234', 10);
    adminRepo.findOne!.mockResolvedValue({ id: 1, storeId: 1, username: 'admin', password: hashed } as Admin);

    const result = await service.adminLogin('store01', 'admin', 'admin1234');
    expect(result.accessToken).toBe('mock-token');
    expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({ adminId: 1, storeId: 1, role: 'admin' }));
  });

  // TC-BE-002
  it('should throw on invalid store code', async () => {
    storeService.getStore!.mockRejectedValue(new NotFoundException());
    await expect(service.adminLogin('invalid', 'admin', 'admin1234')).rejects.toThrow();
  });

  // TC-BE-003
  it('should throw on wrong password', async () => {
    storeService.getStore!.mockResolvedValue(mockStore as any);
    const hashed = await bcrypt.hash('admin1234', 10);
    adminRepo.findOne!.mockResolvedValue({ id: 1, storeId: 1, username: 'admin', password: hashed } as Admin);

    await expect(service.adminLogin('store01', 'admin', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  // TC-BE-004
  it('should login table with new session', async () => {
    storeService.getStore!.mockResolvedValue(mockStore as any);
    tableRepo.findOne!.mockResolvedValue({ id: 5, storeId: 1, tableNo: 1, sessionId: null } as TableEntity);
    tableRepo.save!.mockImplementation(async (e: any) => e);

    const result = await service.tableLogin('store01', 1);
    expect(result.accessToken).toBe('mock-token');
    expect(result.tableNo).toBe(1);
    expect(result.sessionId).toBeDefined();
    expect(tableRepo.save).toHaveBeenCalled();
  });

  // TC-BE-005
  it('should keep existing session on table login', async () => {
    storeService.getStore!.mockResolvedValue(mockStore as any);
    tableRepo.findOne!.mockResolvedValue({ id: 5, storeId: 1, tableNo: 1, sessionId: 'existing-session' } as TableEntity);

    const result = await service.tableLogin('store01', 1);
    expect(result.sessionId).toBe('existing-session');
    expect(tableRepo.save).not.toHaveBeenCalled();
  });
});
