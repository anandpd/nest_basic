import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from './interceptors';
import { AuthGuard } from './auth.guard';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) { }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        const { email, password } = body;
        const { token, newUser } = await this.authService.signup(email, password);
        return { success: true, data: { user: newUser, token } }
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    @UseGuards(AuthGuard)
    async signIn(@Body() body: CreateUserDto, @CurrentUser() user: User) {
        const { password, id } = user;
        const { token } = await this.authService.signin(body.email, body.password, password, id);
        delete user.password;
        return { success: true, data: { token, user: user } }
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    async getCurrentLoggedUser(@CurrentUser() user: User) {
        return user;
    }

    @Get('/:id')
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    async findUser(@Param('id') id: string) {
        if (!Number.isInteger(id) || !id) throw new BadRequestException('id is not passed')
        return await this.userService.findOne({ "id": +id }, true);
    }

    @Get()
    async findAllUsers(email: string) {
        return await this.userService.find({ "email": email });
    }

    @Delete("/:id")
    async removeUser(@Param('id') id: string) {
        await this.userService.remove(+id);
    }

    @Patch("/:id")
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return await this.userService.update(+id, body);
    }

}
