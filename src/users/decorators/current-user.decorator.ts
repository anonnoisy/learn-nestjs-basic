import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common'

/**
 * Create custom decorator for getting the current user
 * and the custom decorator must be create from nestjs 'createParamDecorator'
 * because to get the currently user is come from the interceptor
 * which is custom nestjs interceptor
 * 
 * We need to define the current user interceptor inside controller
 * before use the current user decorator
 * because the user data is come from the current user interceptor
 */
export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        // decorator data is come from the param of decorator it self
        // console.log("decorator data:\n", data);
        // console.log("decorator execution context:\n", context);

        // get the data from the session
        // which is the session is come from request
        const request = context.switchToHttp().getRequest();
        const user = request.currentUser;
        console.log("user from decorator:", user)

        return user;
    }
);