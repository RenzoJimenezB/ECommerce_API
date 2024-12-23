import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';

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

  async create(product: CreateProductDto) {
    return this.productsRepository.create(product);
  }

  async findAll(page: number, limit: number): Promise<PaginatedProductsDto> {
    return this.productsRepository.findAll(page, limit);
  }

  async findOne(id: string): Promise<Product> {
    return this.productsRepository.findOneById(id);
  }

  async update(id: string, updateData: UpdateProductDto) {
    let dbCategory: Category;

    if (updateData.category) {
      const category = await this.categoriesRepository.findById(
        updateData.category,
      );

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateData.category} not foun`,
        );
      }
      dbCategory = category;
    }

    return this.productsRepository.update(id, {
      ...updateData,
      category: dbCategory,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
