import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { HousingApplication } from './housing-application.entity';

@Entity('regional_priorities')
export class RegionalPriority {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'housing_application_id', type: 'bigint' })
  housingApplicationId: number;

  @Column({ name: 'local_city_ratio', type: 'int', nullable: true })
  localCityRatio?: number; // 해당 시/군 우선공급 비율

  @Column({ name: 'local_province_ratio', type: 'int', nullable: true })
  localProvinceRatio?: number; // 해당 도 우선공급 비율

  @Column({ name: 'other_region_ratio', type: 'int', nullable: true })
  otherRegionRatio?: number; // 기타 지역 비율

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToOne(() => HousingApplication, (housing) => housing.regionalPriority, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'housing_application_id' })
  housingApplication: HousingApplication;
}