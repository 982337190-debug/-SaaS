import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_operation_logs')
export class ContractOperationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ nullable: true })
  operator?: string;

  @Column({ nullable: true })
  operator_name?: string;

  @Column()
  operation_type: string;

  @Column({ type: 'text' })
  operation_content: string;

  @ManyToOne(() => Contract, (contract) => contract.operation_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  operation_time: Date;
}
