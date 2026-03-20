import { IsString, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsString() @IsNotEmpty() storeCode: string;
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() password: string;
}

export class TableLoginDto {
  @IsString() @IsNotEmpty() storeCode: string;
  @IsNotEmpty() tableNo: number;
}
