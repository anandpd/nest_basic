import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService = null;
    let userReplicaService: Partial<UsersService> = null;

    beforeEach(async () => {
        const users: Array<User> = [];

        userReplicaService = {
            find: () => Promise.resolve([]),
            findOne: (obj) => {
                const [filterUsers] = users.filter(x => x.email === obj.email);
                return Promise.resolve(filterUsers as User)
            },
            create: (email: string, hashedPassword: string) => {
                const newUser = {
                    id: Math.floor(Math.random()*999999),
                    email: email,
                    password: hashedPassword
                } as User;
                users.push(newUser);
                return Promise.resolve(newUser);
            }
        }
        const jwtServiceReplica = {
            sign: () => "somerandomtoken"
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: userReplicaService
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceReplica
                }
            ]
        }).compile();
        authService = module.get(AuthService);
    });

    it('should create an instance of auth-service', async () => {
        expect(authService).toBeDefined();
    });

    it('should create a new User intance', async () => {
        const { newUser } = await authService.signup('anand99909@goomail.com', 'password');
        expect(newUser.password).not.toEqual('password');
        const rounds = 10;
        const salt = await bcrypt.genSalt(rounds);
        expect(salt).toBeDefined();
        const hashedPassword = await bcrypt.hash(newUser.password, salt);
    });

    it('should throw an error if user signs up with email that is in use', async (done) => {
        // userReplicaService.findOne = () => {
        //     return Promise.resolve({ id: 1, email: "anand@goomail.com", password: "password" } as User)
        // }
        await authService.signup("anand@goomail.com", "password");
        try {
            await authService.signup("anand@goomail.com", "password");
        } catch (error) {
            if (error.name == "BadRequestException") done();
        }
    });

    it('should thrown an error if signin() is called with unused email', async (done) => {
        try {
            await authService.signin('faakdfa', 'afakfkdfa', 'hdkjsfhkadsfk', 1);
        } catch (error) {
            done();
        }
    });

    it('should thrown an error if invalid password is provided', async (done) => {
        const user = {
            email: 'anand@yopmail.com',
            password: 'password'
        }
        await authService.signup(user.email, "password9090x0x0");
        try {
            await authService.signin(user.email, user.password, 'fajdfkakkhsfak', 1);
        } catch (error) {
            if (error.message == 'Invalid Credentials !') done();
        }
    })

    it('should return a user if correct password is provided',async (done) => {
        const user = {
            email: 'anand@yopmail.com',
            password: 'password'
        }
        const signupUser = await authService.signup(user.email, user.password);
        const resp = await authService.signin(user.email, user.password, signupUser.newUser.password, signupUser.newUser.id);
        expect(resp).toBeDefined();
        done();
    })

})