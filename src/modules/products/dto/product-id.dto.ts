import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductIdDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
