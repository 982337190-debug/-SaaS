import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { Resource } from './resource.entity';
import { ResourceType } from './quote-day-resource.entity';
import { ProcurementInquiry } from './procurement-inquiry.entity';

export enum ProcurementStatus {
  PENDING = '待询价',
  INQUIRING = '询价中',
  QUOTED = '报价完成',
  CONFIRMING = '待确认',
  BOOKED = '已预订完成',
  CANCELLED = '已取消',
}

@Entity('procurements')
export class Procurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: ResourceType;

  @Column()
  name: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @ManyToOne(() => Resource)
  resource: Resource;

  @Column({ nullable: true })
  resource_id: string;

  @Column({ nullable: true })
  supplier: string;

  @ManyToOne(() => Team)
  team: Team;

  @Column()
  team_id: string;

  @Column({
    type: 'varchar',
    default: ProcurementStatus.PENDING,
  })
  status: ProcurementStatus;

  @Column({ type: 'decimal', nullable: true })
  confirmed_price: number;

  @Column({ nullable: true })
  quantity: string;

  @Column({ nullable: true })
  remarks: string;

  @OneToMany(() => ProcurementInquiry, inquiry => inquiry.procurement)
  inquiries: ProcurementInquiry[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}