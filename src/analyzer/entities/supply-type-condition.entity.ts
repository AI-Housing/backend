import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SupplyType } from './supply-type.entity';
import { ConditionTemplate } from './condition-template.entity';

export enum ConditionType {
  REQUIRED = 'REQUIRED',
  PREFERRED = 'PREFERRED',
  BONUS = 'BONUS',
}

@Entity('supply_type_conditions')
@Unique(['supplyTypeId', 'conditionTemplateId'])
export class SupplyTypeCondition {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'supply_type_id', type: 'bigint' })
  supplyTypeId: number;

  @Column({ name: 'condition_template_id', type: 'bigint' })
  conditionTemplateId: number;

  @Column({ 
    name: 'specific_numeric_value', 
    type: 'decimal', 
    precision: 15, 
    scale: 2, 
    nullable: true 
  })
  specificNumericValue?: number;

  @Column({ name: 'specific_boolean_value', nullable: true })
  specificBooleanValue?: boolean;

  @Column({ name: 'specific_text_value', type: 'text', nullable: true })
  specificTextValue?: string;

  @Column({ name: 'specific_operator', length: 10, nullable: true })
  specificOperator?: string;

  @Column({
    name: 'condition_type',
    type: 'enum',
    enum: ConditionType,
    default: ConditionType.REQUIRED,
  })
  conditionType: ConditionType;

  @Column({ name: 'score_points', type: 'int', default: 0 })
  scorePoints: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplyType, (supplyType) => supplyType.conditions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_type_id' })
  supplyType: SupplyType;

  @ManyToOne(() => ConditionTemplate, (template) => template.supplyTypeConditions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'condition_template_id' })
  conditionTemplate: ConditionTemplate;
}