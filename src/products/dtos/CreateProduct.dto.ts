export class CreateProductDto {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  ownerId: number;
}
