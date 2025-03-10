import { UserRole } from 'src/utils/constants';

export type CreateUserParams = {
  username: string;
  password: string;
  role: UserRole;
};

export type UpdateUserParams = {
  username: string;
  password: string;
  role: UserRole;
};

export type CreateProductParams = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  ownerId: number;
};

export type UpdateProductParams = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

class BuyItem {
  productId: number;
  quantity: number;
}

export type BuyProductsParams = {
  items: BuyItem[];
};

type Product = {
  id: number;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type UserWithoutPassword = {
  id: number;
  username: string;
  role: UserRole;
  createdAt: Date;
  productsOwned: Product[];
};
