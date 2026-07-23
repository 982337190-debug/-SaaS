import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './team.entity';

export enum ItineraryStatus {
  DRAFT = '编辑中',
  CONFIRMED = '已确认',
  EXECUTING = '执行中',
  COMPLETED = '已完成',
}

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team)
  team: Team;

  @Column()
  team_id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column()
  days: number;

  @Column({
    type: 'varchar',
    default: ItineraryStatus.DRAFT,
  })
  status: ItineraryStatus;

  @Column({ type: 'json', nullable: true })
  days_data: any;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}