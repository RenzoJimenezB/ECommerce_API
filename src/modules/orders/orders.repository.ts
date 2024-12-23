import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetail } from '../order-details/entities/order-detail.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private repository: Repository<Order>,

    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(order: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const user = await this.usersRepository.findById(order.userId, manager);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newOrder = manager.getRepository(Order).create({ user });
      await manager.save(newOrder);

      const { products, totalPrice } =
        await this.productsRepository.processProducts(order.products, manager);

      if (products.length === 0) {
        throw new BadRequestException('No valid products were ordered');
      }

      await manager.getRepository(OrderDetail).save({
        products,
        price: totalPrice,
        order: newOrder,
      });

      await queryRunner.commitTransaction();

      return this.repository.findOne({
        where: { id: newOrder.id },
        relations: { orderDetail: true },
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.repository.find();
  }

  async findByUserId(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.findBy({ user });
  }

  async findById(orderId: string, userId: string): Promise<Order> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order = await this.repository.findOne({
      where: { id: orderId, user },
      relations: { orderDetail: { products: true } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
