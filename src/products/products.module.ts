import { Module } from '@nestjs/common';
import { ProductsService } from 'src/products/services/products/products.service';
import { ProductsController } from 'src/products/controllers/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
