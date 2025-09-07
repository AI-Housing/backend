import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupplyType } from './supply-type.entity';

@Entity('subscription_requirements')
export class SubscriptionRequirement {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'supply_type_id', type: 'bigint' })
  supplyTypeId: number;

  @Column({ name: 'subscription_period_months', type: 'int', nullable: true })
  subscriptionPeriodMonths?: number;

  @Column({ name: 'deposit_count', type: 'int', nullable: true })
  depositCount?: number;

  @Column({ name: 'deposit_amount', type: 'bigint', nullable: true })
  depositAmount?: number; // 천원 단위

  @Column({ name: 'housing_type_limit', length: 100, nullable: true })
  housingTypeLimit?: string;

  @Column({ name: 'account_types', type: 'text', array: true, nullable: true })
  accountTypes?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplyType, (supplyType) => supplyType.subscriptionRequirements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_type_id' })
  supplyType: SupplyType;
}