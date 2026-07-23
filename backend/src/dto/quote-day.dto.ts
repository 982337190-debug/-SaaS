import { IsString, IsNumber, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteDayResourceDto } from './quote-day-resource.dto';

export class QuoteDayDto {
  @IsNumber()
  day_num: number;

  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  city?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteDayResourceDto)
  resources: QuoteDayResourceDto[];
}