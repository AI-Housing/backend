import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MatchingResult } from './matching-result.entity';
import { SupplyType } from './supply-type.entity';

export enum CompetitionLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum QualificationRecommendationLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

@Entity('supply_type_qualifications')
export class SupplyTypeQualification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'matching_result_id', type: 'bigint' })
  matchingResultId: number;

  @Column({ name: 'supply_type_id', type: 'bigint' })
  supplyTypeId: number;

  @Column({ name: 'is_eligible' })
  isEligible: boolean;

  @Column({ name: 'eligibility_reasons', type: 'text', array: true, nullable: true })
  eligibilityReasons?: string[];

  @Column({ name: 'ineligibility_reasons', type: 'text', array: true, nullable: true })
  ineligibilityReasons?: string[];

  @Column({
    name: 'estimated_competition',
    type: 'enum',
    enum: CompetitionLevel,
    nullable: true,
  })
  estimatedCompetition?: CompetitionLevel;

  @Column({ name: 'priority_rank', type: 'int', nullable: true })
  priorityRank?: number;

  @Column({
    name: 'recommendation_level',
    type: 'enum',
    enum: QualificationRecommendationLevel,
  })
  recommendationLevel: QualificationRecommendationLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => MatchingResult, (matching) => matching.supplyTypeQualifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matching_result_id' })
  matchingResult: MatchingResult;

  @ManyToOne(() => SupplyType, (supplyType) => supplyType.qualifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_type_id' })
  supplyType: SupplyType;
}