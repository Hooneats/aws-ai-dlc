import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderHistory } from './order-history.entity';

@Entity()
export class OrderHistoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  historyId: number;

  @ManyToOne(() => OrderHistory, (history) => history.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'historyId' })
  history: OrderHistory;

  @Column()
  orderId: number;

  @Column({ type: 'enum', enum: ['COMPLETED', 'CANCELLED'] })
  status: 'COMPLETED' | 'CANCELLED';

  @Column()
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  memo: string | null;

  @Column({ type: 'json' })
  items: Array<{ menuName: string; quantity: number; unitPrice: number; originalPrice: number; discountRate: number }>;

  @Column()
  orderedAt: Date;
}
