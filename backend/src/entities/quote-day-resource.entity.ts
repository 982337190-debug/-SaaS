import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QuoteDay } from './quote-day.entity';
import { Resource } from './resource.entity';

export enum ResourceType {
  HOTEL = '酒店',
  VEHICLE = '车辆',
  MEAL = '餐',
  GUIDE = '导游',
  TICKET = '景点票',
}

@Entity('quote_day_resources')
export class QuoteDayResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QuoteDay)
  day: QuoteDay;

  @Column()
  day_id: string;

  @ManyToOne(() => Resource)
  resource: Resource;

  @Column({ nullable: true })
  resource_id: string;

  @Column({ type: 'varchar' })
  type: ResourceType;

  @Column()
  name: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  detail: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  supplier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}