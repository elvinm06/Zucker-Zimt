import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * Site-wide contact and branding data — a single row table.
 * The primary key is fixed so there can never be a second row.
 */
@Entity('settings')
export class Settings {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: '' })
  name: string;

  @Column({ type: 'varchar', default: '' })
  tagline: string;

  /** International format without "+" or spaces: 4915112345678 */
  @Column({ type: 'varchar', default: '' })
  whatsapp: string;

  @Column({ type: 'varchar', default: '' })
  telegram: string;

  @Column({ type: 'varchar', default: '' })
  instagram: string;

  @Column({ type: 'varchar', default: '' })
  phone: string;

  @Column({ type: 'varchar', default: '' })
  address: string;

  @Column({ type: 'varchar', default: '' })
  hours: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export const SETTINGS_ID = 'singleton';
