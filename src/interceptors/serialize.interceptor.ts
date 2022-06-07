import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

// Create custom type safe for DTO
interface ClassConstructor {
	new (...args: any[]): {}
}

// Create custom decorator for serialize
export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: any) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		// Run something before a request is handled by the request handler
		console.log('Running before the request handler');

		return next.handle().pipe(
			map((data: any) => {
				// Run something before the response is sent out
				console.log('Running before response is sent out');

				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true
				})
			})
		);
	}
}