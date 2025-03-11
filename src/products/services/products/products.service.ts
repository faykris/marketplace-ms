import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BuyProductsParams,
  CreateProductParams,
  UpdateProductParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  findProductById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async getAllProducts() {
    const products = await this.productRepository.find({
      relations: ['owner'],
    });

    return products.map((product) => {
      const { owner, ...rest } = product;

      return {
        ...rest,
        ownerUsername: owner?.username,
      };
    });
  }

  async getProductsByOwnerId(ownerId: number) {
    return this.productRepository
      .find({
        where: { owner: { id: ownerId } },
        relations: ['owner'],
      })
      .then((products) =>
        products.map((product) => {
          const { owner, ...rest } = product;

          return {
            ...rest,
            ownerUsername: owner?.username,
          };
        }),
      );
  }

  async createProduct(productDetails: CreateProductParams) {
    const { ownerId, ...productProperties } = productDetails;
    const user = await this.usersService.findUserById(ownerId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const { password: _, ...userWithoutPassword } = user;

    const newProduct = this.productRepository.create({
      ...productProperties,
      image_url: productProperties.imageUrl,
      owner: userWithoutPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, productDetails: UpdateProductParams) {
    const { imageUrl, ...productProperties } = productDetails;
    const result =  await this.productRepository.update(
      { id },
      {
        ...productProperties,
        ...(imageUrl ? { image_url: imageUrl } : {}),
        updatedAt: new Date(),
      },
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async deleteProduct(id: number) {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async buyProducts({ items }: BuyProductsParams) {
    const productIds = items.map((item) => item.productId);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    for (const { productId, quantity } of items) {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        throw new NotFoundException(`Product not found, id: ${productId}`);
      }

      if (product.quantity < quantity) {
        throw new BadRequestException(
          `Insufficient quantity for product with id: ${productId}`,
        );
      }

      product.quantity -= quantity;
    }

    await this.productRepository.save(products);

    return products;
  }

  async searchProducts(
    query: string,
    minPrice?: number,
    maxPrice?: number,
    ownerIds?: number[],
  ) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.owner', 'owner');

    if (query) {
      qb.where('product.name LIKE :query OR product.sku LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (minPrice != null && maxPrice != null) {
      qb.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice != null) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice != null) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (ownerIds && ownerIds.length > 0) {
      qb.andWhere('product.owner_id IN (:...ownerIds)', { ownerIds });
    }

    return qb.getMany().then((products) =>
      products.map((product) => {
        const { owner, ...rest } = product;

        return {
          ...rest,
          ownerUsername: owner?.username,
        };
      }),
    );
  }

  async createProducts(
    productDetailsList: CreateProductParams[],
  ): Promise<Product[]> {
    const newProducts = await Promise.all(
      productDetailsList.map(async (productDetails) => {
        const { ownerId, ...productProperties } = productDetails;
        const user = await this.usersService.findUserById(ownerId);

        if (!user) {
          throw new NotFoundException(`User with id ${ownerId} was not found`);
        }

        const newProduct = this.productRepository.create({
          ...productProperties,
          image_url: productProperties.imageUrl,
          owner: user,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return newProduct;
      }),
    );

    return this.productRepository.save(newProducts);
  }
}
