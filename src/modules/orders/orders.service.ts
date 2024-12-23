import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { plainToInstance } from 'class-transformer';
import { PublicOrderDto } from './dto/public-order.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  async create(order: CreateOrderDto): Promise<PublicOrderDto> {
    const newOrder = await this.ordersRepository.create(order);
    return plainToInstance(PublicOrderDto, newOrder);
  }

  async findAll(): Promise<PublicOrderDto[]> {
    const orders = await this.ordersRepository.findAll();
    return plainToInstance(PublicOrderDto, orders);
  }

  async findOne(orderId: string, userId: string): Promise<PublicOrderDto> {
    const order = await this.ordersRepository.findById(orderId, userId);
    return plainToInstance(PublicOrderDto, order);
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
