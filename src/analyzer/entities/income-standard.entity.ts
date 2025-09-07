import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupplyType } from './supply-type.entity';

export enum StandardType {
  PRIORITY = 'PRIORITY',
  GENERAL = 'GENERAL',
  LOTTERY = 'LOTTERY',
}

@Entity('income_standards')
export class IncomeStandard {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'supply_type_id', type: 'bigint' })
  supplyTypeId: number;

  @Column({
    name: 'standard_type',
    type: 'enum',
    enum: StandardType,
  })
  standardType: StandardType;

  @Column({ type: 'int' })
  percentage: number; // 100, 120, 130 등

  @Column({ name: 'dual_income_percentage', type: 'int', nullable: true })
  dualIncomePercentage?: number;

  @Column({ type: 'int' })
  ratio: number; // 공급비율 (70, 20, 10 등)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplyType, (supplyType) => supplyType.incomeStandards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_type_id' })
  supplyType: SupplyType;
}