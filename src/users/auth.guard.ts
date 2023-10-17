import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly userService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token: string = request.headers.token;
            if (!token) throw new UnauthorizedException("Not authorized to view this route !!");
            const isValid = await this.jwtService.verify(token);
            if (!isValid) throw new UnauthorizedException("You are not authorized or dont have permission to view this route");
            const entry = await this.userService.findOne({ id: isValid.id }, true);
            request.userId = entry.id;
            return true;
        } catch (error) {
            Logger.error(error.message, "AuthGuard");
            throw error;
        }
    }
}