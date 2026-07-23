import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateProcurementDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsDate()
  start_date: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  resource_id?: string;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsString()
  team_id: string;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateProcurementDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  resource_id?: string;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateInquiryDto {
  @IsString()
  source: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  quoted_price?: number;
}