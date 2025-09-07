import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserSubscriptionAccount } from './user-subscription-account.entity';
import { MatchingResult } from './matching-result.entity';
import { PriorityScore } from './priority-score.entity';

export enum EmploymentType {
  EMPLOYEE = 'EMPLOYEE',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
}

@Entity('user_qualifications')
export class UserQualification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId?: number;

  // 개인정보
  @Column({ type: 'int' })
  age: number;

  @Column({ name: 'is_married', default: false })
  isMarried: boolean;

  @Column({ name: 'marriage_date', type: 'date', nullable: true })
  marriageDate?: Date;

  @Column({ name: 'is_first_time_homebuyer', default: false })
  isFirstTimeHomebuyer: boolean;

  @Column({ name: 'household_size', type: 'int', default: 1 })
  householdSize: number;

  // 자녀정보
  @Column({ name: 'children_count', type: 'int', default: 0 })
  childrenCount: number;

  @Column({ name: 'minor_children_count', type: 'int', default: 0 })
  minorChildrenCount: number;

  @Column({ name: 'has_newborn', default: false })
  hasNewborn: boolean;

  @Column({ name: 'newborn_birth_date', type: 'date', nullable: true })
  newbornBirthDate?: Date;

  // 부모부양정보
  @Column({ name: 'supports_elderly_parent', default: false })
  supportsElderlyParent: boolean;

  @Column({ name: 'elderly_support_period_months', type: 'int', nullable: true })
  elderlySupportPeriodMonths?: number;

  // 거주지정보
  @Column({ name: 'current_address', length: 200 })
  currentAddress: string;

  @Column({ name: 'residence_period_months', type: 'int' })
  residencePeriodMonths: number;

  @Column({ name: 'has_local_connection', default: false })
  hasLocalConnection: boolean;

  // 주택보유현황
  @Column({ name: 'has_owned_house', default: false })
  hasOwnedHouse: boolean;

  @Column({ name: 'current_house_count', type: 'int', default: 0 })
  currentHouseCount: number;

  @Column({ name: 'previous_house_count', type: 'int', default: 0 })
  previousHouseCount: number;

  @Column({ name: 'last_house_sale_date', type: 'date', nullable: true })
  lastHouseSaleDate?: Date;

  @Column({ name: 'house_value', type: 'bigint', nullable: true })
  houseValue?: number; // 천원 단위

  // 소득정보
  @Column({ name: 'applicant_income', type: 'bigint' })
  applicantIncome: number; // 월소득 (천원)

  @Column({
    name: 'applicant_employment_type',
    type: 'enum',
    enum: EmploymentType,
    nullable: true,
  })
  applicantEmploymentType?: EmploymentType;

  @Column({ name: 'spouse_income', type: 'bigint', default: 0 })
  spouseIncome: number;

  @Column({
    name: 'spouse_employment_type',
    type: 'enum',
    enum: EmploymentType,
    nullable: true,
  })
  spouseEmploymentType?: EmploymentType;

  @Column({ name: 'household_income', type: 'bigint' })
  householdIncome: number;

  @Column({ name: 'annual_income', type: 'bigint' })
  annualIncome: number;

  @Column({ name: 'is_dual_income', default: false })
  isDualIncome: boolean;

  // 자산정보
  @Column({ name: 'real_estate_assets', type: 'bigint', default: 0 })
  realEstateAssets: number;

  @Column({ name: 'financial_assets', type: 'bigint', default: 0 })
  financialAssets: number;

  @Column({ name: 'vehicle_assets', type: 'bigint', default: 0 })
  vehicleAssets: number;

  @Column({ name: 'total_assets', type: 'bigint', default: 0 })
  totalAssets: number;

  // 특별자격
  @Column({ name: 'has_institutional_recommendation', default: false })
  hasInstitutionalRecommendation: boolean;

  @Column({ name: 'institution_type', length: 100, nullable: true })
  institutionType?: string;

  @Column({ name: 'has_special_status', default: false })
  hasSpecialStatus: boolean;

  @Column({ name: 'special_status_type', length: 100, nullable: true })
  specialStatusType?: string;

  @Column({ name: 'has_disability', default: false })
  hasDisability: boolean;

  @Column({ name: 'is_north_korean_defector', default: false })
  isNorthKoreanDefector: boolean;

  // 청약이력
  @Column({ name: 'has_won_before', default: false })
  hasWonBefore: boolean;

  @Column({ name: 'last_win_date', type: 'date', nullable: true })
  lastWinDate?: Date;

  @Column({ name: 'rewinning_restriction_end_date', type: 'date', nullable: true })
  rewinningRestrictionEndDate?: Date;

  @Column({ name: 'has_applied_recently', default: false })
  hasAppliedRecently: boolean;

  // 제한사항
  @Column({ name: 'has_overseas_residence', default: false })
  hasOverseasResidence: boolean;

  @Column({ name: 'overseas_residence_months', type: 'int', default: 0 })
  overseasResidenceMonths: number;

  @Column({ name: 'has_criminal_record', default: false })
  hasCriminalRecord: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.qualification, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToOne(() => UserSubscriptionAccount, (subscription) => subscription.userQualification, {
    cascade: true,
    eager: false,
  })
  subscriptionAccount: UserSubscriptionAccount;

  @OneToMany(() => MatchingResult, (matching) => matching.userQualification)
  matchingResults: MatchingResult[];

  @OneToOne(() => PriorityScore, (priority) => priority.userQualification, {
    cascade: true,
    eager: false,
  })
  priorityScore: PriorityScore;
}