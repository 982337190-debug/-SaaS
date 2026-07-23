import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quote } from './quote.entity';
import { QuoteDayResource } from './quote-day-resource.entity';

@Entity('quote_days')
export class QuoteDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quote)
  quote: Quote;

  @Column()
  quote_id: string;

  @Column()
  day_num: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  city: string;

  @OneToMany(() => QuoteDayResource, resource => resource.day)
  resources: QuoteDayResource[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}