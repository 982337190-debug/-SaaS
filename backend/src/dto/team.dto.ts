import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  customer_id: string;

  @IsString()
  @IsOptional()
  quote_id?: string;

  @IsString()
  @IsOptional()
  quote_name?: string;

  @IsNumber()
  people: number;

  @IsString()
  @IsOptional()
  op_id?: string;

  @IsDate()
  departure_date: Date;

  @IsDate()
  @IsOptional()
  return_date?: Date;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  quote_id?: string;

  @IsString()
  @IsOptional()
  quote_name?: string;

  @IsNumber()
  @IsOptional()
  people?: number;

  @IsString()
  @IsOptional()
  op_id?: string;

  @IsDate()
  @IsOptional()
  departure_date?: Date;

  @IsDate()
  @IsOptional()
  return_date?: Date;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateTeamStatusDto {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  remark?: string;
}