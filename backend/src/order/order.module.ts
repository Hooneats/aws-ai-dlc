import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { OrderHistoryItem } from './entities/order-history-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MenuModule } from '../menu/menu.module';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderHistory, OrderHistoryItem]), MenuModule, SseModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
