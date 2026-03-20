import { Controller, Get, Post, Patch, Param, UseGuards, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceCallService } from './service-call.service';
import { AdminGuard, TableGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateServiceCallDto } from './dto/service-call.dto';

@ApiTags('ServiceCalls')
@Controller('service-calls')
export class ServiceCallController {
  constructor(private readonly svc: ServiceCallService) {}

  @Post() @UseGuards(TableGuard) @ApiBearerAuth() @ApiOperation({ summary: '서비스 호출 요청' })
  create(@CurrentUser('tableId') tableId: number, @Body() dto: CreateServiceCallDto) { return this.svc.create(tableId, dto.menuId); }

  @Patch(':id/confirm') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '서비스 호출 확인' })
  confirm(@Param('id', ParseIntPipe) id: number) { return this.svc.confirm(id); }

  @Patch(':id/complete') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '서비스 호출 완료' })
  complete(@Param('id', ParseIntPipe) id: number) { return this.svc.complete(id); }

  @Get('pending') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '미처리 서비스 호출 조회' })
  findPending() { return this.svc.findPending(); }
}
