import { Product } from "../entities/product.entity";

export class PaginatedProductsDto {
  /**
   * Retrieved products
   */
  data: Product[];

  /**
   * Number of items returned
   */
  itemsCount: number;

  /**
   * Total number of products
   */
  totalItems: number;

  /**
   * Page number passed as query param
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;
}
