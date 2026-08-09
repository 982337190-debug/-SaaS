import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('contract_versions')
export class ContractVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_id: string;

  @Column()
  version_no: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  change_reason?: string;

  @Column({ nullable: true })
  file_id?: string;

  @Column({ nullable: true })
  creator?: string;

  @Column({ nullable: true })
  creator_name?: string;

  @ManyToOne(() => Contract, (contract) => contract.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @CreateDateColumn()
  created_at: Date;
}
