import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private readonly repo: Repository<Menu>) {}

  async create(storeId: number, name: string, price: number, description: string | null, categoryId: number, imageUrl?: string): Promise<Menu> {
    return this.repo.save({ storeId, name, price, description, categoryId, imageUrl });
  }

  async update(menuId: number, fields: Partial<Pick<Menu, 'name' | 'price' | 'description' | 'categoryId' | 'imageUrl' | 'sortOrder'>>): Promise<Menu> {
    const menu = await this.repo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    if (!menu.isActive) throw new BadRequestException('비활성 메뉴는 수정할 수 없습니다.');
    Object.assign(menu, fields);
    return this.repo.save(menu);
  }

  async delete(menuId: number): Promise<void> {
    const menu = await this.repo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    menu.isActive = false;
    await this.repo.save(menu);
  }

  async findByCategory(categoryId: number, activeOnly = true): Promise<Menu[]> {
    const where: any = { categoryId };
    if (activeOnly) where.isActive = true;
    return this.repo.find({ where, order: { sortOrder: 'ASC' } });
  }

  async findByIds(menuIds: number[]): Promise<Menu[]> {
    return this.repo.find({ where: { id: In(menuIds) }, relations: ['category'] });
  }

  async findAll(storeId: number, activeOnly = true): Promise<Menu[]> {
    const where: any = { storeId };
    if (activeOnly) where.isActive = true;
    return this.repo.find({ where, order: { sortOrder: 'ASC' } });
  }

  async findRecommended(storeId: number): Promise<Menu[]> {
    return this.repo.find({ where: { storeId, isRecommended: true, isActive: true }, order: { sortOrder: 'ASC' } });
  }

  getDiscountedPrice(menu: Menu): { originalPrice: number; discountRate: number; finalPrice: number } {
    const finalPrice = menu.discountRate > 0 ? menu.price - Math.floor(menu.price * menu.discountRate / 100) : menu.price;
    return { originalPrice: menu.price, discountRate: menu.discountRate, finalPrice };
  }

  async setRecommended(menuId: number, isRecommended: boolean): Promise<Menu> {
    const menu = await this.repo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    menu.isRecommended = isRecommended;
    return this.repo.save(menu);
  }

  async setDiscount(menuId: number, discountRate: number): Promise<Menu> {
    if (discountRate < 0 || discountRate > 99) throw new BadRequestException('할인율은 1~99% 사이여야 합니다.');
    const menu = await this.repo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    menu.discountRate = discountRate;
    return this.repo.save(menu);
  }

  async setSoldOut(menuId: number, isSoldOut: boolean): Promise<Menu> {
    const menu = await this.repo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    menu.isSoldOut = isSoldOut;
    return this.repo.save(menu);
  }

  async updateOrder(menuIds: number[], sortOrders: number[]): Promise<void> {
    for (let i = 0; i < menuIds.length; i++) {
      await this.repo.update(menuIds[i], { sortOrder: sortOrders[i] });
    }
  }
}
