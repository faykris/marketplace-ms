export class BuyItemDto {
  productId: number;
  quantity: number;
}

export class BuyProductsDto {
  items: BuyItemDto[];
}
