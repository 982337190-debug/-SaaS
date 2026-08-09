import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_files')
export class ContractFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column({ default: 'V1.0' })
  version_no: string;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  file_type?: string;

  @Column()
  file_url: string;

  @Column({ type: 'bigint', nullable: true })
  file_size?: number;

  @Column({ nullable: true })
  upload_user?: string;

  @ManyToOne(() => Contract, (contract) => contract.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  created_at: Date;
}
