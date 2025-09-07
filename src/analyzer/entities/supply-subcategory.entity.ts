import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SupplyCategory } from './supply-category.entity';
import { SupplyType } from './supply-type.entity';

@Entity('supply_subcategories')
export class SupplySubcategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ name: 'subcategory_code', length: 20, unique: true })
  subcategoryCode: string;

  @Column({ name: 'subcategory_name', length: 100 })
  subcategoryName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_special_supply', default: false })
  isSpecialSupply: boolean;

  @Column({ name: 'requires_income_standard', default: false })
  requiresIncomeStandard: boolean;

  @Column({ name: 'requires_asset_standard', default: false })
  requiresAssetStandard: boolean;

  @Column({ name: 'requires_subscription', default: false })
  requiresSubscription: boolean;

  @Column({ name: 'requires_priority_ranking', default: false })
  requiresPriorityRanking: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplyCategory, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: SupplyCategory;

  @OneToMany(() => SupplyType, (supplyType) => supplyType.subcategory)
  supplyTypes: SupplyType[];
}