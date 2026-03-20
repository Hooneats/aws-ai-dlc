import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { AdminGuard, TableGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateOrderDto, UpdateOrderStatusDto, BatchUpdateStatusDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly svc: OrderService) {}

  @Patch('batch-status') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 일괄 상태 변경' })
  batchUpdateStatus(@Body() dto: BatchUpdateStatusDto) { return this.svc.batchUpdateStatus(dto.orderIds, dto.status); }

  @Post() @UseGuards(TableGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 생성' })
  create(@CurrentUser('tableId') tableId: number, @CurrentUser('sessionId') sessionId: string, @Body() dto: CreateOrderDto) { return this.svc.create(tableId, sessionId, dto.items, dto.memo); }

  @Patch(':id/status') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 상태 변경' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) { return this.svc.updateStatus(id, dto.status); }

  @Patch(':id/cancel') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 취소' })
  cancel(@Param('id', ParseIntPipe) id: number) { return this.svc.cancel(id); }

  @Delete(':id') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.delete(id); }

  @Delete(':id/items/:itemId') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '주문 항목 삭제' })
  removeItem(@Param('id', ParseIntPipe) id: number, @Param('itemId', ParseIntPipe) itemId: number) { return this.svc.deleteItem(id, itemId); }

  @Get('session/:sessionId') @UseGuards(TableGuard) @ApiBearerAuth() @ApiOperation({ summary: '세션별 주문 조회' })
  findBySession(@Param('sessionId') sessionId: string) { return this.svc.findBySession(sessionId); }

  @Get('table/:tableId') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '테이블별 주문 조회' })
  findByTable(@Param('tableId', ParseIntPipe) tableId: number, @Query('date') date?: string) { return this.svc.findByTable(tableId, date); }
}
