import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async onModuleInit() {
    await this.addCategories();
  }

  async addCategories() {
    return this.categoriesRepository.addCategories();
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }
}
