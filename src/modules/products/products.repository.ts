import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { CategoriesRepository } from '../categories/categories.repository';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import * as data from '../../utils/data.json';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async addProducts() {
    const categories = await this.categoriesRepository.findAll();
    const categoryMap = new Map(
      categories.map((category) => [category.name, category]),
    );

    const products = data.map((element) => {
      const category = categoryMap.get(element.category);

      return {
        name: element.name,
        description: element.description,
        price: element.price,
        stock: element.stock,
        category,
      };
    });

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(products)
      .orIgnore()
      .execute();
  }

  async findAll(page: number, limit: number): Promise<PaginatedProductsDto> {
    const skip = (page - 1) * limit;
    const take = limit;
    console.log(`returning items from indices ${skip} to ${skip + take - 1}`);

    const [results, total] = await this.repository.findAndCount({
      skip,
      take,
      relations: { category: true },
    });

    const inStock = results.filter((product) => product.stock > 0);

    return {
      data: inStock,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneById(id: string, manager?: EntityManager): Promise<Product> {
    const repository = manager
      ? manager.getRepository(Product)
      : this.repository;

    const product = await repository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
