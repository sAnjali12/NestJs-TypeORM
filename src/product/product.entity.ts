import { PrimaryGeneratedColumn, BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
    createProduct(createProductDto: import("./dto/create-product.dto").CreateProductDTO): Product | PromiseLike<Product> {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: string;
}