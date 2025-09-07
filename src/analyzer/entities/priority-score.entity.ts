import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserQualification } from './user-qualification.entity';

@Entity('priority_scores')
export class PriorityScore {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_qualification_id', type: 'bigint' })
  userQualificationId: number;

  @Column({ name: 'children_score', type: 'int', default: 0 })
  childrenScore: number;

  @Column({ name: 'elderly_parent_score', type: 'int', default: 0 })
  elderlyParentScore: number;

  @Column({ name: 'local_residence_score', type: 'int', default: 0 })
  localResidenceScore: number;

  @Column({ name: 'subscription_period_score', type: 'int', default: 0 })
  subscriptionPeriodScore: number;

  @Column({ name: 'total_score', type: 'int', default: 0 })
  totalScore: number;

  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;

  // Relations
  @OneToOne(() => UserQualification, (qualification) => qualification.priorityScore, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_qualification_id' })
  userQualification: UserQualification;
}