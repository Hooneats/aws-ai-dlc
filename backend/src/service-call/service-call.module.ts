import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCall } from './entities/service-call.entity';
import { ServiceCallService } from './service-call.service';
import { ServiceCallController } from './service-call.controller';
import { MenuModule } from '../menu/menu.module';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCall]), MenuModule, SseModule],
  controllers: [ServiceCallController],
  providers: [ServiceCallService],
  exports: [ServiceCallService],
})
export class ServiceCallModule {}
