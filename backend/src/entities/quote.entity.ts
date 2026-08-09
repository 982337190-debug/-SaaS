import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { QuoteDay } from './quote-day.entity';

export enum QuoteStatus {
  DRAFT = '草稿',
  PENDING = '待审批',
  SENT = '已发送客户',
  CONFIRMED = '客户确认',
  EXPIRED = '失效',
}

export enum QuoteType {
  GROUP = '散团',
  CORPORATE = '企业团建',
  OFFICIAL = '公务团',
  STUDY = '研学团',
}

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  quote_no: string;

  @Column()
  name: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: string;

  @Column({ type: 'varchar' })
  type: QuoteType;

  @Column()
  people: number;

  @Column({ type: 'date' })
  departure_date: Date;

  @Column({ nullable: true })
  days: number;

  @Column({
    type: 'varchar',
    default: QuoteStatus.DRAFT,
  })
  status: QuoteStatus;

  @Column({ nullable: true })
  total_amount: number;

  @Column({ nullable: true })
  cost_amount: number;

  @Column({ nullable: true })
  remarks: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column()
  created_by_id: string;

  @OneToMany(() => QuoteDay, day => day.quote)
  days_data: QuoteDay[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
