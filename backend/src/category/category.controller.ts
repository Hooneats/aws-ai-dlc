import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/auth.guard';
import { CategoryService } from './category.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCategoryDto, UpdateCategoryDto, UpdateCategoryOrderDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly svc: CategoryService) {}

  @Patch('order') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '카테고리 순서 변경' })
  updateOrder(@Body() dto: UpdateCategoryOrderDto) { return this.svc.updateOrder(dto.ids, dto.sortOrders); }

  @Post() @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '카테고리 생성' })
  create(@CurrentUser('storeId') storeId: number, @Body() dto: CreateCategoryDto) { return this.svc.create(storeId, dto.name, dto.sortOrder); }

  @Patch(':id') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '카테고리 수정' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.svc.update(id, dto.name, dto.sortOrder); }

  @Delete(':id') @UseGuards(AdminGuard) @ApiBearerAuth() @ApiOperation({ summary: '카테고리 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.delete(id); }

  @Get() @ApiOperation({ summary: '카테고리 목록 조회' })
  findAll(@Query('storeId') storeId: number, @Query('includeHidden') includeHidden?: string) { return this.svc.findAll(+storeId, includeHidden === 'true'); }
}
