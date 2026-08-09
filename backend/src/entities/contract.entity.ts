import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContractFile } from './contract-file.entity';
import { ContractAudit } from './contract-audit.entity';
import { ContractVersion } from './contract-version.entity';
import { ContractReminder } from './contract-reminder.entity';
import { ContractAiTask } from './contract-ai-task.entity';
import { ContractAiIssue } from './contract-ai-issue.entity';
import { ContractOperationLog } from './contract-operation-log.entity';

export enum ContractType {
  FRAMEWORK = 'FRAMEWORK',
  PROJECT = 'PROJECT',
  PURCHASE = 'PURCHASE',
  SUPPLEMENT = 'SUPPLEMENT',
}

export enum ContractSourceType {
  OUR_TEMPLATE = 'OUR_TEMPLATE',
  SUPPLIER_TEMPLATE = 'SUPPLIER_TEMPLATE',
}

export enum ContractPaymentType {
  ADVANCE = 'ADVANCE',
  ACCOUNT_PERIOD = 'ACCOUNT_PERIOD',
}

export enum ContractPaymentCycleType {
  DEPARTURE = 'DEPARTURE',
  RETURN = 'RETURN',
  SERVICE_COMPLETE = 'SERVICE_COMPLETE',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  AUDITING = 'AUDITING',
  PENDING_MANUAL_REVIEW = 'PENDING_MANUAL_REVIEW',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SIGNED = 'SIGNED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
  CANCELLED = 'CANCELLED',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  contract_no: string;

  @Column()
  contract_name: string;

  @Column({ type: 'varchar', default: ContractType.FRAMEWORK })
  contract_type: ContractType;

  @Column({ type: 'varchar', default: ContractSourceType.OUR_TEMPLATE })
  source_type: ContractSourceType;

  @Column({ nullable: true })
  supplier_id?: string;

  @Column({ nullable: true })
  supplier_name?: string;

  @Column({ type: 'simple-json', nullable: true })
  resource_types?: string[];

  @Column({ nullable: true })
  project_id?: string;

  @Column({ nullable: true })
  project_name?: string;

  @Column({ nullable: true })
  order_id?: string;

  @Column({ nullable: true })
  order_name?: string;

  @Column({ nullable: true })
  quotation_id?: string;

  @Column({ nullable: true })
  quotation_name?: string;

  @Column({ nullable: true })
  contract_mode?: string;

  @Column({ nullable: true })
  order_bind_type?: string;

  @Column({ nullable: true })
  cooperation_area?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  annual_estimated_amount?: number;

  @Column({ type: 'text', nullable: true })
  cooperation_scope?: string;

  @Column({ type: 'text', nullable: true })
  refund_rule?: string;

  @Column({ type: 'text', nullable: true })
  breach_liability?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  amount?: number;

  @Column({ default: 'CNY' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tax_rate?: number;

  @Column({ type: 'varchar', default: ContractPaymentType.ADVANCE })
  payment_type: ContractPaymentType;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  advance_ratio?: number;

  @Column({ type: 'text', nullable: true })
  tail_payment_condition?: string;

  @Column({ type: 'varchar', nullable: true })
  payment_cycle_type?: ContractPaymentCycleType;

  @Column({ type: 'int', nullable: true })
  payment_cycle_days?: number;

  @Column({ type: 'date', nullable: true })
  start_date?: string;

  @Column({ type: 'date', nullable: true })
  end_date?: string;

  @Column({ type: 'varchar', default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column({ default: 'V1.0' })
  current_version: string;

  @Column({ nullable: true })
  owner_id?: string;

  @Column({ nullable: true })
  owner_name?: string;

  @Column({ nullable: true })
  created_by_id?: string;

  @Column({ nullable: true })
  created_by_name?: string;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @Column({ type: 'text', nullable: true })
  cancel_reason?: string;

  @Column({ type: 'text', nullable: true })
  archive_reason?: string;

  @Column({ type: 'int', nullable: true })
  ai_risk_score?: number;

  @Column({ nullable: true })
  ai_risk_level?: string;

  @Column({ nullable: true })
  ai_audit_result?: string;

  @Column({ type: 'text', nullable: true })
  ai_audit_summary?: string;

  @Column({ type: 'simple-json', nullable: true })
  ai_extracted_fields?: Record<string, any>;

  @Column({ nullable: true })
  ai_last_task_id?: string;

  @Column({ type: 'datetime', nullable: true })
  ai_last_audited_at?: string;

  @OneToMany(() => ContractFile, (file) => file.contract)
  files?: ContractFile[];

  @OneToMany(() => ContractAudit, (audit) => audit.contract)
  audits?: ContractAudit[];

  @OneToMany(() => ContractVersion, (version) => version.contract)
  versions?: ContractVersion[];

  @OneToMany(() => ContractReminder, (reminder) => reminder.contract)
  reminders?: ContractReminder[];

  @OneToMany(() => ContractAiTask, (task) => task.contract)
  ai_tasks?: ContractAiTask[];

  @OneToMany(() => ContractAiIssue, (issue) => issue.contract)
  ai_issues?: ContractAiIssue[];

  @OneToMany(() => ContractOperationLog, (log) => log.contract)
  operation_logs?: ContractOperationLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
