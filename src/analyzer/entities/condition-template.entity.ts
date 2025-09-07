import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ConditionCategory } from './condition-category.entity';
import { SupplyTypeCondition } from './supply-type-condition.entity';

@Entity('condition_templates')
export class ConditionTemplate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ name: 'condition_code', length: 50, unique: true })
  conditionCode: string;

  @Column({ name: 'condition_name', length: 200 })
  conditionName: string;

  @Column({ name: 'condition_description', type: 'text', nullable: true })
  conditionDescription?: string;

  @Column({ name: 'numeric_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
  numericValue?: number;

  @Column({ name: 'boolean_value', nullable: true })
  booleanValue?: boolean;

  @Column({ name: 'text_value', type: 'text', nullable: true })
  textValue?: string;

  @Column({ name: 'operator', length: 10, default: '=' })
  operator: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ConditionCategory, (category) => category.templates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ConditionCategory;

  @OneToMany(() => SupplyTypeCondition, (condition) => condition.conditionTemplate)
  supplyTypeConditions: SupplyTypeCondition[];
}