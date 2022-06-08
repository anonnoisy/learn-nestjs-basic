import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

/**
 * Tell the typescript than this request might
 * have a current user property that is going
 * to be an instance of a User
 */
declare global {
	namespace Express {
		interface Request {
			currentUser?: User;
		}
	}
}

/**
 * This middleware will replace the CurrentUserInterceptor
 * because CurrentUserInterceptor is executed before guard
 * but we need to get the current user when the admin guard is called.
 *
 * And this middleware will be used globally
 * and run after the middleware were cookies have been initialized or executed
*/
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.session || {};

		if (userId) {
			const user = await this.usersService.findOne(userId);
			req.currentUser = user;
		}

		next();
	}
}