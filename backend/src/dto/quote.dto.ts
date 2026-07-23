import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteDayDto } from './quote-day.dto';

export class CreateQuoteDto {
  @IsString()
  name: string;

  @IsString()
  customer_id: string;

  @IsString()
  type: string;

  @IsNumber()
  people: number;

  @IsString()
  departure_date: string;

  @IsNumber()
  @IsOptional()
  days?: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteDayDto)
  @IsOptional()
  days_data?: QuoteDayDto[];
}

export class UpdateQuoteDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  people?: number;

  @IsString()
  @IsOptional()
  departure_date?: string;

  @IsNumber()
  @IsOptional()
  days?: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteDayDto)
  @IsOptional()
  days_data?: QuoteDayDto[];
}

export class SubmitQuoteDto {
  @IsString()
  @IsOptional()
  remark?: string;
}