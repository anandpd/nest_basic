import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "./user.entity";


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private readonly jwtService: JwtService) { }

    async signup(email: string, password: string): Promise<{ newUser: User, token: string }> {
        // see if email is in use
        let user = await this.usersService.findOne({ email });
        if (user) throw new BadRequestException('Email in use');

        // hash password
        const rounds = 10;
        const salt = await bcrypt.genSalt(rounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        user = await this.usersService.create(email, hashedPassword);

        // return user
        const token = this.jwtService.sign({ id: user.id });
        return { newUser: user, token };
    }

    async signin(email: string, password: string, hashedPassword: string, id: number): Promise<any> {
        const user = await this.usersService.findOne({ email: email });
        if (!user) throw new NotFoundException('User not Found !');
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) throw new BadRequestException('Invalid Credentials !')
        const token = this.jwtService.sign({ id: id });
        return token;
    }
}