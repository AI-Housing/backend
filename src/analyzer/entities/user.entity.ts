import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserQualification } from './user-qualification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  name?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => UserQualification, (qualification) => qualification.user, {
    cascade: true,
    eager: false,
  })
  qualification: UserQualification;
}