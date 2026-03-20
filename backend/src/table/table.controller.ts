import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TableService } from './table.service';
import { AdminGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateTableDto } from './dto/table.dto';

@ApiTags('Tables')
@Controller('tables')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class TableController {
  constructor(private readonly svc: TableService) {}

  @Post() @ApiOperation({ summary: '테이블 추가' })
  create(@CurrentUser('storeId') storeId: number, @Body() dto: CreateTableDto) { return this.svc.create(storeId, dto.tableNo); }

  @Delete(':id') @ApiOperation({ summary: '테이블 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.delete(id); }

  @Get() @ApiOperation({ summary: '테이블 목록 조회' })
  findAll(@CurrentUser('storeId') storeId: number) { return this.svc.findAll(storeId); }

  @Post(':id/setup') @ApiOperation({ summary: '테이블 초기 설정' })
  setup(@Param('id', ParseIntPipe) id: number) { return this.svc.setup(id); }

  @Post(':id/settle') @ApiOperation({ summary: '테이블 정산' })
  settle(@Param('id', ParseIntPipe) id: number) { return this.svc.settle(id); }

  @Get(':id/history') @ApiOperation({ summary: '과거 주문 내역 조회' })
  getHistory(@Param('id', ParseIntPipe) id: number, @Query('date') date?: string) { return this.svc.getHistory(id, date); }
}
