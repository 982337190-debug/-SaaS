import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  team_id: string;

  @IsString()
  name: string;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsNumber()
  days: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateItineraryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsNumber()
  @IsOptional()
  days?: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateItineraryStatusDto {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  remark?: string;
}