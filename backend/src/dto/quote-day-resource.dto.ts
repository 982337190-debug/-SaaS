import { IsString, IsOptional, IsNumber } from 'class-validator';

export class QuoteDayResourceDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  resource_id?: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  supplier?: string;
}