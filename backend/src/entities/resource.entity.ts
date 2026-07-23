import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ResourceType } from './quote-day-resource.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: ResourceType;

  @Column()
  name: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  price_unit: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}