import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { AdminGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Statistics')
@Controller('statistics')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly svc: StatisticsService) {}

  @Get('dashboard') @ApiOperation({ summary: '실시간 대시보드' })
  getTodayDashboard(@CurrentUser('storeId') storeId: number) { return this.svc.getTodayDashboard(storeId); }

  @Get('daily') @ApiOperation({ summary: '일별 매출 요약' })
  getDailySummary(@CurrentUser('storeId') storeId: number, @Query('date') date: string) { return this.svc.getDailySummary(storeId, date); }

  @Get('daily/tables') @ApiOperation({ summary: '테이블별 매출' })
  getByTable(@CurrentUser('storeId') storeId: number, @Query('date') date: string) { return this.svc.getByTable(storeId, date); }

  @Get('daily/menus') @ApiOperation({ summary: '메뉴별 판매 현황' })
  getByMenu(@CurrentUser('storeId') storeId: number, @Query('date') date: string) { return this.svc.getByMenu(storeId, date); }

  @Get('period') @ApiOperation({ summary: '기간별 매출 통계' })
  getPeriodSummary(@CurrentUser('storeId') storeId: number, @Query('startDate') startDate: string, @Query('endDate') endDate: string) { return this.svc.getPeriodSummary(storeId, startDate, endDate); }
}
