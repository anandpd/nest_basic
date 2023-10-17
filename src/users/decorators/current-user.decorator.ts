import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, executionContext: ExecutionContext) => {
        const req = executionContext.switchToHttp().getRequest();
        return req.currentUser;
    }
)