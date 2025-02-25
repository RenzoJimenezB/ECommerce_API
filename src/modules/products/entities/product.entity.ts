import { Category } from "src/modules/categories/entities/category.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { OrderDetail } from "../../orderDetails/entities/orderDetails.entity";


@Entity({ name: "products" })
export class Product {


  @PrimaryGeneratedColumn("uuid")
  id: string;


  @Column({ type: "varchar", length: 50, unique: true })
  name: string;


  @Column({ length: 100 })
  description: string;


  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;


  @Column({ type: "int", nullable: false })
  stock: number;


  @Column({
    type: "text",
    default: "https://images.com/default-image.jpg"
  })
  imgUrl: string;


  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category: Category;


  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetail;
}
