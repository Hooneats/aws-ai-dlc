import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TableEntity } from '../../table/entities/table.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'tableId' })
  table: TableEntity;

  @Column({ length: 36 })
  sessionId: string;

  @Column({ type: 'enum', enum: ['PENDING', 'PREPARING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' })
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';

  @Column({ default: 0 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  memo: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
