import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
