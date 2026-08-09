import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

export enum ContractAiTaskStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('contract_ai_tasks')
export class ContractAiTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ unique: true })
  task_id: string;

  @Column({ nullable: true })
  file_id?: string;

  @Column({ nullable: true })
  workflow_run_id?: string;

  @Column({ nullable: true })
  provider_task_id?: string;

  @Column({ type: 'varchar', default: ContractAiTaskStatus.PROCESSING })
  status: ContractAiTaskStatus;

  @Column({ type: 'text', nullable: true })
  progress_message?: string;

  @Column({ type: 'text', nullable: true })
  error_message?: string;

  @Column({ type: 'simple-json', nullable: true })
  raw_response?: Record<string, any>;

  @ManyToOne(() => Contract, (contract) => contract.ai_tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
