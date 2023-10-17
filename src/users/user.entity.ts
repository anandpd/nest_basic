import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string

    @OneToMany(() => Report, (report) => report.user)
    reports: Array<Report>

    @AfterInsert()
    logAfterInsert() {
        Logger.log(`Inserted User() with id = ${this.id}`);
    }

    @AfterUpdate()
    logAfterUpdate() {
        Logger.log(`Updated User() with id = ${this.id}`);
    }

    @AfterRemove()
    logAfterRemove() {
        Logger.log(`Removed User() with id = ${this.id}`);
    }
}