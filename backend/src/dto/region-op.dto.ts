import { IsString, IsOptional } from 'class-validator';

export class CreateRegionOpDto {
  @IsString()
  region: string;

  @IsString()
  op_id: string;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateRegionOpDto {
  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  op_id?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}