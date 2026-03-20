import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Store } from '../store/entities/store.entity';
import { Admin } from '../auth/entities/admin.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Admin, Category])],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
