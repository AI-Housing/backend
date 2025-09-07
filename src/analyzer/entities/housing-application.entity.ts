import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SupplyType } from './supply-type.entity';
import { RegionalPriority } from './regional-priority.entity';
import { MatchingResult } from './matching-result.entity';

export enum HousingType {
  PUBLIC_SALE = 'PUBLIC_SALE',
  PRIVATE_SALE = 'PRIVATE_SALE',
  PUBLIC_RENTAL = 'PUBLIC_RENTAL',
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('housing_applications')
export class HousingApplication {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ name: 'announcement_date', type: 'date', nullable: true })
  announcementDate?: Date;

  @Column({ name: 'application_start_date', type: 'date', nullable: true })
  applicationStartDate?: Date;

  @Column({ name: 'application_end_date', type: 'date', nullable: true })
  applicationEndDate?: Date;

  @Column({ name: 'winner_announcement_date', type: 'date', nullable: true })
  winnerAnnouncementDate?: Date;

  @Column({ name: 'contract_date', type: 'date', nullable: true })
  contractDate?: Date;

  @Column({ length: 200 })
  location: string;

  @Column({ name: 'detailed_address', type: 'text', nullable: true })
  detailedAddress?: string;

  @Column({
    name: 'housing_type',
    type: 'enum',
    enum: HousingType,
  })
  housingType: HousingType;

  @Column({ length: 200, nullable: true })
  developer?: string;

  @Column({ name: 'total_units', type: 'int' })
  totalUnits: number;

  @Column({ name: 'pdf_file_path', length: 500, nullable: true })
  pdfFilePath?: string;

  @Column({ name: 'raw_text', type: 'text', nullable: true })
  rawText?: string;

  @Column({ default: false })
  processed: boolean;

  @Column({
    name: 'processing_status',
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.PENDING,
  })
  processingStatus: ProcessingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => SupplyType, (supplyType) => supplyType.housingApplication, {
    cascade: true,
    eager: false,
  })
  supplyTypes: SupplyType[];

  @OneToOne(() => RegionalPriority, (regional) => regional.housingApplication, {
    cascade: true,
    eager: false,
  })
  regionalPriority: RegionalPriority;

  @OneToMany(() => MatchingResult, (matching) => matching.housingApplication)
  matchingResults: MatchingResult[];
}