import { User } from "src/modules/users/entities/user.entity";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { OrderDetail } from "../../orderDetails/entities/orderDetails.entity";


@Entity({ name: "orders" })
export class Order {


  @PrimaryGeneratedColumn("uuid")
  id: string;


  @Column({ type: "timestamptz" })
  date: Date;


  @BeforeInsert()
  assignDefaultDate() {
    this.date = new Date();
  }


  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: User;

  
  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail;
}
