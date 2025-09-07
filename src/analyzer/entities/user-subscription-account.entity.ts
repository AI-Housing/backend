import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserQualification } from './user-qualification.entity';

export enum AccountType {
  HOUSING_SUBSCRIPTION = 'HOUSING_SUBSCRIPTION',
  YOUTH_HOUSING = 'YOUTH_HOUSING',
  WORKER_HOUSING = 'WORKER_HOUSING',
}

@Entity('user_subscription_accounts')
export class UserSubscriptionAccount {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_qualification_id', type: 'bigint' })
  userQualificationId: number;

  @Column({ name: 'has_account', default: false })
  hasAccount: boolean;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: AccountType,
    nullable: true,
  })
  accountType?: AccountType;

  @Column({ name: 'subscription_date', type: 'date', nullable: true })
  subscriptionDate?: Date;

  @Column({ name: 'subscription_period_months', type: 'int', nullable: true })
  subscriptionPeriodMonths?: number;

  @Column({ name: 'deposit_count', type: 'int', nullable: true })
  depositCount?: number;

  @Column({ name: 'deposit_amount', type: 'bigint', nullable: true })
  depositAmount?: number; // 천원 단위

  @Column({ name: 'housing_type_limit', length: 100, nullable: true })
  housingTypeLimit?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToOne(() => UserQualification, (qualification) => qualification.subscriptionAccount, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_qualification_id' })
  userQualification: UserQualification;
}