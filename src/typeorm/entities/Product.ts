import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/typeorm/entities/User';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.productsOwned)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
