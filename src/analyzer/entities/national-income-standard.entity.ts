import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('national_income_standards')
@Unique(['year', 'householdSize'])
export class NationalIncomeStandard {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'household_size', type: 'int' })
  householdSize: number;

  @Column({ name: 'standard_100', type: 'bigint' })
  standard100: number; // 100% 기준 (천원)

  @Column({ name: 'standard_120', type: 'bigint', nullable: true })
  standard120?: number;

  @Column({ name: 'standard_130', type: 'bigint', nullable: true })
  standard130?: number;

  @Column({ name: 'standard_140', type: 'bigint', nullable: true })
  standard140?: number;

  @Column({ name: 'standard_200', type: 'bigint', nullable: true })
  standard200?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}