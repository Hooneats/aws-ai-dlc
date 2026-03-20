import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Store } from '../store/entities/store.entity';
import { Admin } from '../auth/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
import { Menu } from '../menu/entities/menu.entity';
import { TableEntity } from '../table/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Admin, Category, Menu, TableEntity])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
