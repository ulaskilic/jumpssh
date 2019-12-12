import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Session Table
 */
@Entity("SESSIONS")
export class Session extends BaseEntity {

    @PrimaryGeneratedColumn({name: "ID"})
    public id!: number;

    @Column({name: "IP"})
    public ip!: string;

    @Column({name: "NAME"})
    public name!: string;

    @Column({name: "USER"})
    public user?: string;

    @Column({name: "PASS"})
    public pass?: string;

    constructor(name: string, ip: string, user: string, pass: string) {
        super();
        this.ip = ip;
        this.name = name;
        this.user = user;
        this.pass = pass;
    }
}
