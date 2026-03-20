import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(@InjectRepository(Store) private readonly storeRepo: Repository<Store>) {}

  async getStore(): Promise<Store> {
    const store = await this.storeRepo.findOne({ where: {} });
    if (!store) throw new NotFoundException('매장 정보가 없습니다.');
    return store;
  }
}
