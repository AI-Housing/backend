import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConditionTemplate } from './condition-template.entity';

export enum DataType {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  STRING = 'STRING',
}

@Entity('condition_categories')
export class ConditionCategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'category_code', length: 20, unique: true })
  categoryCode: string;

  @Column({ name: 'category_name', length: 100 })
  categoryName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'data_type',
    type: 'enum',
    enum: DataType,
    default: DataType.STRING,
  })
  dataType: DataType;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => ConditionTemplate, (template) => template.category)
  templates: ConditionTemplate[];
}
