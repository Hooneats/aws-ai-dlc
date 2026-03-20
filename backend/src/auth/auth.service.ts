import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Admin } from './entities/admin.entity';
import { TableEntity } from '../table/entities/table.entity';
import { StoreService } from '../store/store.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(TableEntity) private readonly tableRepo: Repository<TableEntity>,
    private readonly storeService: StoreService,
    private readonly jwtService: JwtService,
  ) {}

  async adminLogin(storeCode: string, username: string, password: string): Promise<{ accessToken: string }> {
    const store = await this.storeService.getStore();
    if (store.code !== storeCode) throw new UnauthorizedException('매장 정보가 일치하지 않습니다.');
    const admin = await this.adminRepo.findOne({ where: { storeId: store.id, username } });
    if (!admin) throw new UnauthorizedException('계정 정보가 일치하지 않습니다.');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    return { accessToken: this.jwtService.sign({ adminId: admin.id, storeId: store.id, role: 'admin' }) };
  }

  async tableLogin(storeCode: string, tableNo: number): Promise<{ accessToken: string; tableNo: number; sessionId: string }> {
    const store = await this.storeService.getStore();
    if (store.code !== storeCode) throw new NotFoundException('매장 정보가 일치하지 않습니다.');
    const table = await this.tableRepo.findOne({ where: { storeId: store.id, tableNo } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');

    let sessionId = table.sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      table.sessionId = sessionId;
      table.sessionStartedAt = new Date();
      await this.tableRepo.save(table);
    }

    return {
      accessToken: this.jwtService.sign({ tableId: table.id, storeId: store.id, sessionId, role: 'table' }),
      tableNo: table.tableNo,
      sessionId,
    };
  }
}
