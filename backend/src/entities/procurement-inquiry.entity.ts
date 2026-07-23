import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Procurement } from './procurement.entity';
import { User } from './user.entity';

export enum InquiryStatus {
  INITIATED = '已发起',
  QUOTED = '报价完成',
  CONFIRMED = '已确认',
}

@Entity('procurement_inquiries')
export class ProcurementInquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Procurement)
  procurement: Procurement;

  @Column()
  procurement_id: string;

  @ManyToOne(() => User)
  operator: User;

  @Column()
  operator_id: string;

  @Column()
  source: string;

  @Column()
  content: string;

  @Column({ type: 'decimal', nullable: true })
  quoted_price: number;

  @Column({
    type: 'varchar',
    default: InquiryStatus.INITIATED,
  })
  status: InquiryStatus;

  @CreateDateColumn()
  created_at: Date;
}