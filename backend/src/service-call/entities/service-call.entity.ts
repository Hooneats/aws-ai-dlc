import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TableEntity } from '../../table/entities/table.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Entity()
export class ServiceCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'tableId' })
  table: TableEntity;

  @Column()
  menuId: number;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @Column({ length: 100 })
  menuName: string;

  @Column({ type: 'enum', enum: ['PENDING', 'CONFIRMED', 'COMPLETED'], default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
