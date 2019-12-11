import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Sessions Table
 */
@Entity("SESSIONS")
export class Sessions {

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
