import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SupplySubcategory } from './supply-subcategory.entity';

@Entity('supply_categories')
export class SupplyCategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'category_code', length: 20, unique: true })
  categoryCode: string;

  @Column({ name: 'category_name', length: 100 })
  categoryName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => SupplySubcategory, (subcategory) => subcategory.category)
  subcategories: SupplySubcategory[];
}