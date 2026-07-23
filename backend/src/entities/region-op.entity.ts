import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('region_ops')
export class RegionOp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  region: string;

  @ManyToOne(() => User)
  op: User;

  @Column()
  op_id: string;

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}