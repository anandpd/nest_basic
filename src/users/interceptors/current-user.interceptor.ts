import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private readonly usersService: UsersService) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const userId = request.userId;
        if (userId) {
            const user = await this.usersService.findOne({ id: userId });
            request.currentUser = user;
        } else request.currentUser = {};
        return next.handle();
    }
}