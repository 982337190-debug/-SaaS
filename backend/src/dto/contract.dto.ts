import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  ContractPaymentCycleType,
  ContractPaymentType,
  ContractSourceType,
  ContractStatus,
  ContractType,
} from '../entities/contract.entity';

export class CreateContractDto {
  @IsString()
  contract_name: string;

  @IsEnum(ContractType)
  contract_type: ContractType;

  @IsEnum(ContractSourceType)
  source_type: ContractSourceType;

  @IsString()
  @IsOptional()
  supplier_id?: string;

  @IsString()
  @IsOptional()
  supplier_name?: string;

  @IsArray()
  @IsOptional()
  resource_types?: string[];

  @IsString()
  @IsOptional()
  project_id?: string;

  @IsString()
  @IsOptional()
  project_name?: string;

  @IsString()
  @IsOptional()
  order_id?: string;

  @IsString()
  @IsOptional()
  order_name?: string;

  @IsString()
  @IsOptional()
  quotation_id?: string;

  @IsString()
  @IsOptional()
  quotation_name?: string;

  @IsString()
  @IsOptional()
  contract_mode?: string;

  @IsString()
  @IsOptional()
  order_bind_type?: string;

  @IsString()
  @IsOptional()
  cooperation_area?: string;

  @IsNumber()
  @IsOptional()
  annual_estimated_amount?: number;

  @IsString()
  @IsOptional()
  cooperation_scope?: string;

  @IsString()
  @IsOptional()
  refund_rule?: string;

  @IsString()
  @IsOptional()
  breach_liability?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  tax_rate?: number;

  @IsEnum(ContractPaymentType)
  payment_type: ContractPaymentType;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  advance_ratio?: number;

  @IsString()
  @IsOptional()
  tail_payment_condition?: string;

  @IsEnum(ContractPaymentCycleType)
  @IsOptional()
  payment_cycle_type?: ContractPaymentCycleType;

  @IsNumber()
  @IsOptional()
  payment_cycle_days?: number;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  owner_id?: string;

  @IsString()
  @IsOptional()
  owner_name?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateContractDto {
  @IsString()
  @IsOptional()
  contract_name?: string;

  @IsEnum(ContractType)
  @IsOptional()
  contract_type?: ContractType;

  @IsEnum(ContractSourceType)
  @IsOptional()
  source_type?: ContractSourceType;

  @IsString()
  @IsOptional()
  supplier_id?: string;

  @IsString()
  @IsOptional()
  supplier_name?: string;

  @IsArray()
  @IsOptional()
  resource_types?: string[];

  @IsString()
  @IsOptional()
  project_id?: string;

  @IsString()
  @IsOptional()
  project_name?: string;

  @IsString()
  @IsOptional()
  order_id?: string;

  @IsString()
  @IsOptional()
  order_name?: string;

  @IsString()
  @IsOptional()
  quotation_id?: string;

  @IsString()
  @IsOptional()
  quotation_name?: string;

  @IsString()
  @IsOptional()
  contract_mode?: string;

  @IsString()
  @IsOptional()
  order_bind_type?: string;

  @IsString()
  @IsOptional()
  cooperation_area?: string;

  @IsNumber()
  @IsOptional()
  annual_estimated_amount?: number;

  @IsString()
  @IsOptional()
  cooperation_scope?: string;

  @IsString()
  @IsOptional()
  refund_rule?: string;

  @IsString()
  @IsOptional()
  breach_liability?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  tax_rate?: number;

  @IsEnum(ContractPaymentType)
  @IsOptional()
  payment_type?: ContractPaymentType;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  advance_ratio?: number;

  @IsString()
  @IsOptional()
  tail_payment_condition?: string;

  @IsEnum(ContractPaymentCycleType)
  @IsOptional()
  payment_cycle_type?: ContractPaymentCycleType;

  @IsNumber()
  @IsOptional()
  payment_cycle_days?: number;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  owner_id?: string;

  @IsString()
  @IsOptional()
  owner_name?: string;

  @IsString()
  @IsOptional()
  remark?: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;
}

export class ContractAuditActionDto {
  @IsString()
  comment: string;
}

export class StartContractAiAuditDto {
  @IsString()
  @IsOptional()
  file_id?: string;
}

export class CreateContractVersionDto {
  @IsString()
  change_reason: string;

  @IsString()
  @IsOptional()
  file_id?: string;

  @IsString()
  @IsOptional()
  version_no?: string;
}

export class CreateContractFileDto {
  @IsString()
  file_name: string;

  @IsString()
  file_url: string;

  @IsNumber()
  @IsOptional()
  file_size?: number;

  @IsString()
  @IsOptional()
  version_no?: string;

  @IsString()
  @IsOptional()
  upload_user?: string;
}

export class CreateContractTemplateDto {
  @IsString()
  template_name: string;

  @IsString()
  contract_type: string;

  @IsArray()
  @IsOptional()
  resource_types?: string[];

  @IsString()
  file_url: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  creator_name?: string;
}

export class ContractReminderActionDto {
  @IsString()
  @IsOptional()
  status?: string;
}
