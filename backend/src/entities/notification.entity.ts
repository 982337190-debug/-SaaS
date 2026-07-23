import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  TODO = 'todo',
  INFO = 'info',
  WARNING = 'warning',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ type: 'varchar' })
  type: NotificationType;

  @Column({
    type: 'varchar',
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  data: string;

  @CreateDateColumn()
  created_at: Date;
}