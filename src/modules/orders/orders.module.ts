import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, ProductsModule],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
