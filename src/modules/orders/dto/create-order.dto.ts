import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProductIdDto } from 'src/modules/products/dto/product-id.dto';

export class CreateOrderDto {
  /**
   * UUID
   * @example cc8c868c-9594-41e4-8427-e9e80f3ca921
   */
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ValidateNested({ each: true })
  @Type(() => ProductIdDto)
  @IsArray()
  @ArrayMinSize(1)
  products: ProductIdDto[];
}
