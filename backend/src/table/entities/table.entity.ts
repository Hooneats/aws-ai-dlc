import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Store } from '../../store/entities/store.entity';

@Entity('tables')
@Unique(['storeId', 'tableNo'])
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  tableNo: number;

  @Column({ type: 'varchar', length: 36, nullable: true })
  sessionId: string | null;

  @Column({ type: 'datetime', nullable: true })
  sessionStartedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
