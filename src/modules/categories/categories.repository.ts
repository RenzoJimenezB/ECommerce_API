import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import * as data from '../../utils/data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
  ) {}
  async addCategories() {
    const categoryNames = Array.from(
      new Set(data.map((element) => element.category)),
    );

    const existingCategories = await this.repository.find({
      where: { name: In(categoryNames) },
    });

    const existingCategoryNames = existingCategories.map(
      (category) => category.name,
    );

    const newCategories = categoryNames
      .filter((name) => !existingCategoryNames.includes(name))
      .map((name) => this.repository.create({ name }));

    if (newCategories.length > 0) {
      await this.repository.save(newCategories);
    }
  }
}
