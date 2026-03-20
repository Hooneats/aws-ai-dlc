import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString() @IsNotEmpty() name: string;
  @IsInt() @Min(0) price: number;
  @IsOptional() @IsString() description?: string;
  @IsInt() categoryId: number;
  @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateMenuDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() @Min(0) price?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() categoryId?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class SetRecommendedDto { @IsBoolean() isRecommended: boolean; }
export class SetDiscountDto { @IsInt() @Min(0) @Max(99) discountRate: number; }
export class SetSoldOutDto { @IsBoolean() isSoldOut: boolean; }
export class UpdateMenuOrderDto { @IsInt({ each: true }) ids: number[]; @IsInt({ each: true }) sortOrders: number[]; }
