import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserQualification } from './user-qualification.entity';
import { HousingApplication } from './housing-application.entity';
import { SupplyTypeQualification } from './supply-type-qualification.entity';

export enum RecommendationLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
}

@Entity('matching_results')
export class MatchingResult {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_qualification_id', type: 'bigint' })
  userQualificationId: number;

  @Column({ name: 'housing_application_id', type: 'bigint' })
  housingApplicationId: number;

  @Column({
    name: 'overall_recommendation',
    type: 'enum',
    enum: RecommendationLevel,
  })
  overallRecommendation: RecommendationLevel;

  @Column({ name: 'matching_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  matchingScore?: number;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ name: 'next_steps', type: 'text', array: true, nullable: true })
  nextSteps?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => UserQualification, (qualification) => qualification.matchingResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_qualification_id' })
  userQualification: UserQualification;

  @ManyToOne(() => HousingApplication, (housing) => housing.matchingResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'housing_application_id' })
  housingApplication: HousingApplication;

  @OneToMany(() => SupplyTypeQualification, (qualification) => qualification.matchingResult, {
    cascade: true,
    eager: false,
  })
  supplyTypeQualifications: SupplyTypeQualification[];
}