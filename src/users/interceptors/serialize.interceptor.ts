import { NestInterceptor, ExecutionContext, CallHandler, Logger, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

type SerializeRes = Observable<any>;

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: InstanceType<any>) {
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): SerializeRes | Promise<SerializeRes> {
        // Run something before request handler
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent:
                const res = plainToInstance(this.dto, data);
                Logger.debug(JSON.stringify(res), "Response Body")
                return res;
            })
        )
    }
}
