import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Product } from 'src/typeorm/entities/Product';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Product],
      synchronize: true,
      ...(process.env.NODE_ENV === 'development'
        ? {}
        : {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
