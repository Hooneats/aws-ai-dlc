import { IsInt, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt() menuId: number;
  @IsInt() @Min(1) quantity: number;
}

export class CreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
  @IsOptional() @IsString() memo?: string;
}

export class UpdateOrderStatusDto { @IsString() @IsNotEmpty() status: string; }
export class BatchUpdateStatusDto { @IsInt({ each: true }) orderIds: number[]; @IsString() @IsNotEmpty() status: string; }
