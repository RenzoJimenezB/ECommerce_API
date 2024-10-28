import { UserRole } from 'src/modules/auth/enum/roles.enum';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 15, default: 'N/A' })
  phone: string;

  @Column({ type: 'varchar', length: 25, default: 'N/A' })
  country: string;

  @Column({ type: 'varchar', length: 25, default: 'N/A' })
  city: string;

  @Column({ type: 'text', default: 'N/A' })
  address: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
