import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: "varchar", length: 100})
    name: string

    @Column({type: "varchar", length: 100, unique: true})
    email: string

    @Column({type: "varchar"})
    @Exclude()
    password: string

    @Column({type: "varchar", nullable: true})
    image: string

}
