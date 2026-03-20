import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from '../../store/entities/store.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isServiceCategory: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
