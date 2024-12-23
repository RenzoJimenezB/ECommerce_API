import { Product } from '../entities/product.entity';

export class PaginatedProductsDto {
  /**
   * Retrieved products
   */
  data: Product[];

  /**
   * Total number of products
   */
  count: number;

  /**
   * Page number passed as query param
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;
}
