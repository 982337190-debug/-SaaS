import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_ai_issues')
export class ContractAiIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ nullable: true })
  risk_type?: string;

  @Column({ nullable: true })
  risk_level?: string;

  @Column({ type: 'text', nullable: true })
  risk_description?: string;

  @Column({ type: 'text', nullable: true })
  original_text?: string;

  @Column({ type: 'text', nullable: true })
  suggestion?: string;

  @ManyToOne(() => Contract, (contract) => contract.ai_issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  created_at: Date;
}
