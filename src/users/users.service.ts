import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) { }

    async create(email: string, password: string): Promise<User> {
        const user = this.repository.create({ email, password });
        return await this.repository.save(user);
    }

    async findOne(filter: any, throwErr: boolean = false) {
        const data = await this.repository.findOneBy(filter);
        if (throwErr && data == null) throw new NotFoundException('User not found !');
        return data;
    }

    async find(filter: any) {
        return await this.repository.find({
            where: {
                ...filter
            }
        });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne({ id: id }, true);
        // in-place
        Object.assign(user, attrs);
        await this.repository.save(user);
        return user;
    }

    async remove(id: number) {
        const user = await this.findOne({ id: id }, true);
        await this.repository.remove(user);
    }
}
