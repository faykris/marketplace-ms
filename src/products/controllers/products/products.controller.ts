import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ProductsService } from 'src/products/services/products/products.service';
import { CreateProductDto } from 'src/products/dtos/CreateProduct.dto';
import { UpdateProductDto } from 'src/products/dtos/UpdateProduct.dto';
import { BuyProductsDto } from 'src/products/dtos/BuyProducts.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('batch')
  createProducts(@Body() createProductsDto: CreateProductDto[]) {
    return this.productService.createProducts(createProductsDto);
  }

  @Get('owners')
  @UseGuards(JwtGuard)
  getProductsByOwnerIds(@Query('id') id: string) {
    const idNumber = parseInt(id, 10);

    return this.productService.getProductsByOwnerId(idNumber);
  }

  @Post('buy')
  async buyProducts(@Body() buyProductsDto: BuyProductsDto) {
    const updatedProducts =
      await this.productService.buyProducts(buyProductsDto);

    return {
      message: 'Products purchased successfully',
      products: updatedProducts,
    };
  }

  @Get('search')
  searchProducts(
    @Query('q') query: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('ownerIds') ownerIds?: string,
  ) {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    let ownerIdsArray: number[] | undefined;

    if (ownerIds) {
      ownerIdsArray = ownerIds.split(',').map((id) => parseInt(id.trim(), 10));
    }

    return this.productService.searchProducts(query, min, max, ownerIdsArray);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProductById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.updateProduct(id, updateProductDto);

    return {
      message: 'Product updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteProductById(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);

    return {
      message: 'Product deleted successfully',
    };
  }
}
