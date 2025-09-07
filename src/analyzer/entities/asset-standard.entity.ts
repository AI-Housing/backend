import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupplyType } from './supply-type.entity';

@Entity('asset_standards')
export class AssetStandard {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'supply_type_id', type: 'bigint' })
  supplyTypeId: number;

  @Column({ name: 'max_real_estate', type: 'bigint', nullable: true })
  maxRealEstate?: number; // 천원 단위

  @Column({ name: 'max_vehicle', type: 'bigint', nullable: true })
  maxVehicle?: number;

  @Column({ name: 'max_financial_assets', type: 'bigint', nullable: true })
  maxFinancialAssets?: number;

  @Column({ name: 'max_total_assets', type: 'bigint', nullable: true })
  maxTotalAssets?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SupplyType, (supplyType) => supplyType.assetStandards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_type_id' })
  supplyType: SupplyType;
}