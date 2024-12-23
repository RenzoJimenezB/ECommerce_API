import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}
  async onModuleInit() {
    await this.addProducts();
  }

  async addProducts() {
    return this.productsRepository.addProducts();
  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(page: number, limit: number): Promise<PaginatedProductsDto> {
    return this.productsRepository.findAll(page, limit);
  }

  async findOne(id: string): Promise<Product> {
    return this.productsRepository.findOneById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
