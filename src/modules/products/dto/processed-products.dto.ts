import { Product } from '../entities/product.entity';

export class ProcessedProductsDto {
  products: Product[];
  totalPrice: number;
}
