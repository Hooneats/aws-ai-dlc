import { IsInt } from 'class-validator';

export class CreateTableDto { @IsInt() tableNo: number; }
