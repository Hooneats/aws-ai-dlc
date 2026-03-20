import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCall } from './entities/service-call.entity';
import { MenuService } from '../menu/menu.service';
import { SseService } from '../sse/sse.service';

@Injectable()
export class ServiceCallService {
  constructor(
    @InjectRepository(ServiceCall) private readonly repo: Repository<ServiceCall>,
    private readonly menuService: MenuService,
    private readonly sseService: SseService,
  ) {}

  async create(tableId: number, menuId: number): Promise<ServiceCall> {
    const menus = await this.menuService.findByIds([menuId]);
    const menu = menus[0];
    if (!menu) throw new NotFoundException('메뉴를 찾을 수 없습니다.');
    if (!menu.isActive) throw new BadRequestException('비활성 항목입니다.');
    if (!(menu as any).category?.isServiceCategory) throw new BadRequestException('서비스 항목이 아닙니다.');

    const sc = await this.repo.save({ tableId, menuId, menuName: menu.name, status: 'PENDING' as const });
    this.sseService.emitServiceCall(sc);
    return sc;
  }

  async confirm(serviceCallId: number): Promise<ServiceCall> {
    const sc = await this.repo.findOne({ where: { id: serviceCallId } });
    if (!sc) throw new NotFoundException('서비스 호출을 찾을 수 없습니다.');
    sc.status = 'CONFIRMED';
    return this.repo.save(sc);
  }

  async complete(serviceCallId: number): Promise<ServiceCall> {
    const sc = await this.repo.findOne({ where: { id: serviceCallId } });
    if (!sc) throw new NotFoundException('서비스 호출을 찾을 수 없습니다.');
    sc.status = 'COMPLETED';
    return this.repo.save(sc);
  }

  async findPending(): Promise<ServiceCall[]> {
    return this.repo.find({ where: { status: 'PENDING' as any }, order: { createdAt: 'ASC' } });
  }

  async clearByTable(tableId: number): Promise<void> {
    await this.repo.delete({ tableId });
  }
}
