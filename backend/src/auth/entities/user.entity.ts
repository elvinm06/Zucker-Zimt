import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  username: string;

  /** bcrypt hash — plain text is never stored. */
  @Column({ type: 'varchar', select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
