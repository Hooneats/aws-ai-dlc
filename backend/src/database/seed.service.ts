import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Store } from '../store/entities/store.entity';
import { Admin } from '../auth/entities/admin.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit() { await this.seed(); }

  async seed(): Promise<void> {
    const existing = await this.storeRepo.findOne({ where: { code: 'store01' } });
    if (existing) return;

    const store = await this.storeRepo.save({ code: 'store01', name: '우리매장' });
    await this.adminRepo.save({ storeId: store.id, username: 'admin', password: await bcrypt.hash('admin1234', 10) });
    await this.categoryRepo.save({ storeId: store.id, name: '기타', isDefault: true, isHidden: true, sortOrder: 9999 });
    await this.categoryRepo.save({ storeId: store.id, name: '서비스 요청', isServiceCategory: true, sortOrder: 9998 });
  }
}
