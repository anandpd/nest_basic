import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from './serialize.interceptor';

// any instance of class
export interface IClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: IClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export { CurrentUserInterceptor } from './current-user.interceptor';