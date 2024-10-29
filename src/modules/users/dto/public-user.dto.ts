import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { UserRole } from 'src/modules/auth/enum/roles.enum';
import { PublicOrderDto } from 'src/modules/orders/dto/public-order.dto';

export class PublicUserDto {
  id: string;

  name: string;

  email: string;

  @Exclude()
  password: string;

  phone: number;

  country: string;

  address: string;

  @Expose({ groups: ['superadmin'] })
  role: UserRole;

  @Transform(({ value }) => plainToInstance(PublicOrderDto, value))
  orders: PublicOrderDto[];
}
