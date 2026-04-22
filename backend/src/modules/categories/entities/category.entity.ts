import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ unique: true })
  categoryName: string;

  // Usamos 'ProductEntity' como string para evitar o erro de 'unknown'
  @OneToMany('ProductEntity', 'category')
  products: any[]; 
}