import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Session Table
 */
@Entity("SESSIONS")
export class Session {

    constructor(name: string, ip: string, user: string, pass: string) {
        this.ip = ip;
        this.name = name;
        this.user = user;
        this.pass = pass;
    }

    @PrimaryGeneratedColumn({name: "ID"})
    id!: number;

    @Column({name: "IP"})
    ip!: string;

    @Column({name: "NAME"})
    name!: string;

    @Column({name: "USER"})
    user?: string;

    @Column({name: "PASS"})
    pass?: string;
}
