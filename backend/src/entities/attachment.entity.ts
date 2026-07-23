import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  original_name: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  mime_type: string;

  @Column({ nullable: true })
  module: string;

  @Column({ nullable: true })
  record_id: string;

  @Column({ nullable: true })
  uploaded_by: string;

  @CreateDateColumn()
  created_at: Date;
}