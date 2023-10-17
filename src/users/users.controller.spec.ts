import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
    let userController: UsersController;
    let userService: Partial<UsersService>;
    let authService: Partial<AuthService>;

    beforeEach(async () => {
        userService = {
            findOne(filter, throwErr) {
                return Promise.resolve(
                    {
                        id: filter.id,
                        email: "anand@yopmail.com",
                        password: "pass"
                    } as User
                )
            },
            find(filter) {
                return Promise.resolve([
                    {
                        id: 1,
                        email: filter.email,
                        password: "password"
                    } as User

                ]
                )
            },
            // remove(id) {

            // },
            // update(id, attrs) {

            // },
        }

        authService = {
            // signup(email, password) {

            // },
            signin(email, password, hashedPassword, id) {
                return Promise.resolve({
                    id: 100,
                    email,
                    password
                } as User)
            },
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                UsersController
            ],
            providers: [
                {
                    provide: UsersService,
                    useValue: userService
                },
                {
                    provide: AuthService,
                    useValue: authService
                },
                {
                    provide: JwtService,
                    useValue: JwtService
                }
            ]
        }).compile();
        userController = module.get(UsersController);
    });

    it('userController instance should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should return all users with filter', async (done) => {
        const users = await userController.findAllUsers('anand@yopmail.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('anand@yopmail.com');
        done();
    });

    it('should return single user with given id', async (done) => {
        const user = await userController.findUser("1");
        expect(user).toBeDefined();
        done();
    });

    it('should throw an erorr if user with given id', async (done) => {
        userService.findOne = () => null;
        try {
            const user = await userController.findUser('1');
            expect(user).toBeNull();
            done();
        } catch (error) {
            done();
        }
    });

    it('should sign in & return user', async () => {
        const currentUserSession = { email: "anand", password: "pass", id: 1 } as User

        const user = await userController.signIn(
            { email: "anand", password: "pass" },
            currentUserSession
        );
        expect(user.data.user.id).toEqual(1);
    })
})