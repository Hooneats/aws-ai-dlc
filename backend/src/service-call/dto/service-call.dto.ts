import { IsInt } from 'class-validator';

export class CreateServiceCallDto { @IsInt() menuId: number; }
