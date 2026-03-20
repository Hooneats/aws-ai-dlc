import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto, TableLoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login') @ApiOperation({ summary: '관리자 로그인' })
  adminLogin(@Body() dto: AdminLoginDto) { return this.authService.adminLogin(dto.storeCode, dto.username, dto.password); }

  @Post('table/login') @ApiOperation({ summary: '테이블 태블릿 인증' })
  tableLogin(@Body() dto: TableLoginDto) { return this.authService.tableLogin(dto.storeCode, dto.tableNo); }
}
