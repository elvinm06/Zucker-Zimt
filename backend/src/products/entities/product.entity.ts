import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 180 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  /**
   * PostgreSQL returns `decimal` as a string, so the transformer converts
   * it back to a number for the JSON response.
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value === null ? null : parseFloat(value)),
    },
  })
  price: number;

  /**
   * Up to 5 image URLs; the first one is the cover shown in the catalogue.
   * Ordering is meaningful, so this is an array rather than a relation.
   */
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  images: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  ingredients: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  allergens: string[];

  @Column({ type: 'boolean', name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
