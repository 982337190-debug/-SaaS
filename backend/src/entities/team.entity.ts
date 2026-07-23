import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { Quote } from './quote.entity';
import { TeamLog } from './team-log.entity';

export enum TeamStatus {
  PENDING = '待生成',
  FORMED = '已成团',
  PROCURING = '采购中',
  EXECUTING = '执行中',
  COMPLETED = '已完成',
}

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  team_no: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column()
  customer_id: string;

  @ManyToOne(() => Quote)
  quote: Quote;

  @Column({ nullable: true })
  quote_id: string;

  @Column({ nullable: true })
  quote_name: string;

  @Column()
  people: number;

  @ManyToOne(() => User)
  op: User;

  @Column({ nullable: true })
  op_id: string;

  @Column({ type: 'date' })
  departure_date: Date;

  @Column({ nullable: true })
  return_date: Date;

  @Column({
    type: 'varchar',
    default: TeamStatus.PENDING,
  })
  status: TeamStatus;

  @Column({ nullable: true })
  remarks: string;

  @OneToMany(() => TeamLog, log => log.team)
  logs: TeamLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}