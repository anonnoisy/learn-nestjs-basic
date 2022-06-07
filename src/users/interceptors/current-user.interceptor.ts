import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable
} from '@nestjs/common'
import { UsersService } from '../users.service'

/**
 * Create current user interceptor to passing the current user
 * into the current user decorator.
 * which is the current is come from the database
 * and the current user is find by id
 * where id come from the session request
 * 
 * We can use the users service to get existing user by depedency injection
 * to injecting the users service into the interceptor we can passing into constructor
 * and use the injectable nestjs decorator
 * and then import the inceptor on provider where is in user module
 * 
 * OR
 * 
 * We can use the interceptor globally
 * by import the inceptor with nestjs APP_INTERCEPTOR
 * on user module
 */
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly usersService: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
        }

        return next.handle()
    }
}