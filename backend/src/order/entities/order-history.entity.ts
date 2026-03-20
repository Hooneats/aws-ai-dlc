import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TableEntity } from '../../table/entities/table.entity';
import { OrderHistoryItem } from './order-history-item.entity';

@Entity()
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'tableId' })
  table: TableEntity;

  @Column({ length: 36 })
  sessionId: string;

  @Column()
  totalAmount: number;

  @Column()
  orderCount: number;

  @Column()
  settledAt: Date;

  @Column()
  createdAt: Date;

  @OneToMany(() => OrderHistoryItem, (item) => item.history, { cascade: true })
  items: OrderHistoryItem[];
}
