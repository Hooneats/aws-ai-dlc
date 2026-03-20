import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Menu } from '../menu/entities/menu.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
  ) {}

  async create(storeId: number, name: string, sortOrder = 0): Promise<Category> {
    return this.repo.save({ storeId, name, sortOrder });
  }

  async update(id: number, name?: string, sortOrder?: number): Promise<Category> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    if (name !== undefined) cat.name = name;
    if (sortOrder !== undefined) cat.sortOrder = sortOrder;
    return this.repo.save(cat);
  }

  async delete(id: number): Promise<void> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    if (cat.isDefault) throw new BadRequestException('기본 카테고리는 삭제할 수 없습니다.');
    if (cat.isServiceCategory) throw new BadRequestException('서비스 요청 카테고리는 삭제할 수 없습니다.');

    const defaultCat = await this.repo.findOne({ where: { storeId: cat.storeId, isDefault: true } });
    if (defaultCat) await this.menuRepo.update({ categoryId: id }, { categoryId: defaultCat.id });
    await this.repo.delete(id);
  }

  async findAll(storeId: number, includeHidden = false): Promise<Category[]> {
    const where: any = { storeId };
    if (!includeHidden) where.isHidden = false;
    return this.repo.find({ where, order: { sortOrder: 'ASC' } });
  }

  async updateOrder(ids: number[], sortOrders: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.repo.update(ids[i], { sortOrder: sortOrders[i] });
    }
  }
}
