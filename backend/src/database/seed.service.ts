import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Store } from '../store/entities/store.entity';
import { Admin } from '../auth/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
import { Menu } from '../menu/entities/menu.entity';
import { TableEntity } from '../table/entities/table.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectRepository(TableEntity) private readonly tableRepo: Repository<TableEntity>,
  ) {}

  async onModuleInit() { await this.seed(); }

  async seed(): Promise<void> {
    const existing = await this.storeRepo.findOne({ where: { code: 'store01' } });
    if (existing) return;

    const store = await this.storeRepo.save({ code: 'store01', name: '우리매장' });
    const sid = store.id;

    // 관리자
    await this.adminRepo.save({ storeId: sid, username: 'admin', password: await bcrypt.hash('admin1234', 10) });

    // 테이블 5개
    for (let i = 1; i <= 5; i++) {
      await this.tableRepo.save({ storeId: sid, tableNo: i });
    }

    // 카테고리
    const catMain = await this.categoryRepo.save({ storeId: sid, name: '메인', sortOrder: 1 });
    const catSide = await this.categoryRepo.save({ storeId: sid, name: '사이드', sortOrder: 2 });
    const catDrink = await this.categoryRepo.save({ storeId: sid, name: '음료', sortOrder: 3 });
    const catService = await this.categoryRepo.save({ storeId: sid, name: '서비스 요청', isServiceCategory: true, sortOrder: 9998 });
    await this.categoryRepo.save({ storeId: sid, name: '기타', isDefault: true, isHidden: true, sortOrder: 9999 });

    // 메인 메뉴
    const menus = [
      { name: '김치찌개', price: 9000, desc: '돼지고기와 묵은지로 끓인 얼큰한 찌개', catId: catMain.id, rec: true },
      { name: '된장찌개', price: 8000, desc: '구수한 된장과 두부가 어우러진 찌개', catId: catMain.id, rec: true },
      { name: '비빔밥', price: 10000, desc: '신선한 나물과 고추장의 조화', catId: catMain.id, rec: true },
      { name: '불고기', price: 13000, desc: '달콤한 양념에 재운 소고기 불고기', catId: catMain.id, rec: true },
      { name: '냉면', price: 11000, desc: '시원한 육수에 쫄깃한 면발', catId: catMain.id, rec: false, discount: 10 },
      { name: '제육볶음', price: 10000, desc: '매콤달콤 돼지고기 볶음', catId: catMain.id, rec: false },
      { name: '순두부찌개', price: 8500, desc: '부드러운 순두부와 해물의 만남', catId: catMain.id, rec: false },
    ];
    for (const m of menus) {
      await this.menuRepo.save({
        storeId: sid, categoryId: m.catId, name: m.name, price: m.price,
        description: m.desc, isRecommended: m.rec ?? false, discountRate: m.discount ?? 0,
      });
    }

    // 사이드 메뉴
    const sides = [
      { name: '계란말이', price: 5000, desc: '폭신한 계란말이' },
      { name: '김치전', price: 6000, desc: '바삭하게 부친 김치전' },
      { name: '떡볶이', price: 5500, desc: '매콤한 떡볶이' },
      { name: '감자튀김', price: 4000, desc: '바삭한 감자튀김' },
    ];
    for (const s of sides) {
      await this.menuRepo.save({ storeId: sid, categoryId: catSide.id, name: s.name, price: s.price, description: s.desc });
    }

    // 음료
    const drinks = [
      { name: '콜라', price: 2000, desc: null },
      { name: '사이다', price: 2000, desc: null },
      { name: '맥주', price: 4000, desc: '시원한 생맥주' },
      { name: '소주', price: 4000, desc: null },
      { name: '매실차', price: 3000, desc: '달콤한 매실차', soldOut: true },
    ];
    for (const d of drinks) {
      await this.menuRepo.save({ storeId: sid, categoryId: catDrink.id, name: d.name, price: d.price, description: d.desc, isSoldOut: d.soldOut ?? false });
    }

    // 서비스 요청 항목
    const services = [
      { name: '물 리필', price: 0 },
      { name: '수저 추가', price: 0 },
      { name: '앞접시 추가', price: 0 },
      { name: '직원 호출', price: 0 },
    ];
    for (const s of services) {
      await this.menuRepo.save({ storeId: sid, categoryId: catService.id, name: s.name, price: s.price });
    }
  }
}
