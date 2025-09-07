import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { HousingApplication } from './housing-application.entity';
import { SupplySubcategory } from './supply-subcategory.entity';
import { SubscriptionRequirement } from './subscription-requirement.entity';
import { IncomeStandard } from './income-standard.entity';
import { AssetStandard } from './asset-standard.entity';
import { SupplyTypeCondition } from './supply-type-condition.entity';
import { SupplyTypeQualification } from './supply-type-qualification.entity';

@Entity('supply_types')
export class SupplyType {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'housing_application_id', type: 'bigint' })
  housingApplicationId: number;

  @Column({ name: 'subcategory_id', type: 'bigint' })
  subcategoryId: number;

  @Column({ type: 'int' })
  units: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => HousingApplication, (housing) => housing.supplyTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'housing_application_id' })
  housingApplication: HousingApplication;

  @ManyToOne(() => SupplySubcategory, (subcategory) => subcategory.supplyTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SupplySubcategory;

  @OneToMany(() => SupplyTypeCondition, (condition) => condition.supplyType, {
    cascade: true,
    eager: false,
  })
  conditions: SupplyTypeCondition[];

  @OneToMany(() => SubscriptionRequirement, (subscription) => subscription.supplyType, {
    cascade: true,
    eager: false,
  })
  subscriptionRequirements: SubscriptionRequirement[];

  @OneToMany(() => IncomeStandard, (income) => income.supplyType, {
    cascade: true,
    eager: false,
  })
  incomeStandards: IncomeStandard[];

  @OneToMany(() => AssetStandard, (asset) => asset.supplyType, {
    cascade: true,
    eager: false,
  })
  assetStandards: AssetStandard[];

  @OneToMany(() => SupplyTypeQualification, (qualification) => qualification.supplyType)
  qualifications: SupplyTypeQualification[];
}