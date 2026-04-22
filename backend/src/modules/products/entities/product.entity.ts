import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @Column({ nullable: true })
  productDescription: string;

  @ManyToOne('CategoryEntity', 'products')
  category: any;

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}