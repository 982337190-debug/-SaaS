import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

export enum ContractAuditStatus {
  PASS = 'PASS',
  REJECT = 'REJECT',
}

@Entity('contract_audits')
export class ContractAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ nullable: true })
  audit_user?: string;

  @Column({ nullable: true })
  audit_user_name?: string;

  @Column({ type: 'varchar' })
  audit_status: ContractAuditStatus;

  @Column({ type: 'text', nullable: true })
  audit_comment?: string;

  @ManyToOne(() => Contract, (contract) => contract.audits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  audit_time: Date;
}
