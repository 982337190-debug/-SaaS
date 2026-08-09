import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

export enum ContractReminderStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DELAYED = 'DELAYED',
}

@Entity('contract_reminders')
export class ContractReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ type: 'int' })
  reminder_days: number;

  @Column({ type: 'date' })
  reminder_date: string;

  @Column({ type: 'varchar', default: ContractReminderStatus.OPEN })
  status: ContractReminderStatus;

  @ManyToOne(() => Contract, (contract) => contract.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  created_at: Date;
}
