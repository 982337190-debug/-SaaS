import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContractTemplateStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

@Entity('contract_templates')
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  template_name: string;

  @Column({ type: 'varchar' })
  contract_type: string;

  @Column({ type: 'simple-json', nullable: true })
  resource_types?: string[];

  @Column()
  file_url: string;

  @Column({ default: 'V1.0' })
  version: string;

  @Column({ type: 'varchar', default: ContractTemplateStatus.ACTIVE })
  status: ContractTemplateStatus;

  @Column({ nullable: true })
  creator?: string;

  @Column({ nullable: true })
  creator_name?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
