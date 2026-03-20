import { Controller, Get, Param, Sse, UseGuards, Req, Headers, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { AdminGuard, TableGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('SSE')
@Controller('sse')
export class SseController {
  constructor(private readonly svc: SseService) {}

  @Sse('admin') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '관리자 SSE 연결' })
  connectAdmin(@CurrentUser('storeId') storeId: number): Observable<any> { return this.svc.connectAdmin(storeId); }

  @Sse('table/:tableId') @UseGuards(TableGuard) @ApiBearerAuth() @ApiOperation({ summary: '테이블 SSE 연결' })
  connectTable(@Param('tableId', ParseIntPipe) tableId: number): Observable<any> { return this.svc.connectTable(tableId); }
}
