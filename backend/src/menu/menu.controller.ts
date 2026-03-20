import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { AdminGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMenuDto, UpdateMenuDto, SetRecommendedDto, SetDiscountDto, SetSoldOutDto, UpdateMenuOrderDto } from './dto/menu.dto';

@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly svc: MenuService) {}

  @Patch('order') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '메뉴 순서 변경' })
  updateOrder(@Body() dto: UpdateMenuOrderDto) { return this.svc.updateOrder(dto.ids, dto.sortOrders); }

  @Get('recommended') @ApiOperation({ summary: '추천 메뉴 조회' })
  findRecommended(@Query('storeId') storeId: number) { return this.svc.findRecommended(+storeId); }

  @Post() @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '메뉴 생성' })
  create(@CurrentUser('storeId') storeId: number, @Body() dto: CreateMenuDto) { return this.svc.create(storeId, dto.name, dto.price, dto.description || null, dto.categoryId, dto.imageUrl); }

  @Patch(':id') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '메뉴 수정' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto) { return this.svc.update(id, dto); }

  @Delete(':id') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '메뉴 삭제 (Soft Delete)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.delete(id); }

  @Patch(':id/recommended') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '추천 설정' })
  setRecommended(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRecommendedDto) { return this.svc.setRecommended(id, dto.isRecommended); }

  @Patch(':id/discount') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '할인 설정' })
  setDiscount(@Param('id', ParseIntPipe) id: number, @Body() dto: SetDiscountDto) { return this.svc.setDiscount(id, dto.discountRate); }

  @Patch(':id/sold-out') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '품절 설정' })
  setSoldOut(@Param('id', ParseIntPipe) id: number, @Body() dto: SetSoldOutDto) { return this.svc.setSoldOut(id, dto.isSoldOut); }

  @Get() @ApiOperation({ summary: '메뉴 목록 조회' })
  findAll(@Query('storeId') storeId: number, @Query('categoryId') categoryId?: string, @Query('activeOnly') activeOnly?: string) {
    return categoryId ? this.svc.findByCategory(+categoryId, activeOnly !== 'false') : this.svc.findAll(+storeId, activeOnly !== 'false');
  }
}
