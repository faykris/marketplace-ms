import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from 'src/utils/constants';
import { Product } from 'src/typeorm/entities/Product';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.owner)
  productsOwned: Product[];
}
