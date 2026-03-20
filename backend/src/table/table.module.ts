import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from './entities/table.entity';
import { OrderHistory } from '../order/entities/order-history.entity';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { OrderModule } from '../order/order.module';
import { ServiceCallModule } from '../service-call/service-call.module';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity, OrderHistory]),
    forwardRef(() => OrderModule),
    forwardRef(() => ServiceCallModule),
    SseModule,
  ],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
