import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService
	) {}

	// @Get('/whoami')
	// async whoAmI(@Session() session: any) {
	// 	return await this.usersService.findOne(session.userId);
	// }

	@Get('/whoami')
	@UseGuards(AuthGuard)
	async whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@Post('/signup')
	async createUser(@Body() request: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signup(request.email, request.password);

		// set user id into session
		session.userId = user.id;

		return user;
	}

	@Post('/signin')
	async signin(@Body() request: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signin(request.email, request.password);

		// set user id into session
		session.userId = user.id;

		return user;
	}

	@Post('/signout')
	async signout(@Session() session: any) {
		session.userId = null;
	}

	@Serialize(UserDto)
	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	@Get()
	findAllUser(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Patch('/:id')
	updateUser(
		@Param('id') id: string,
		@Body() request: UpdateUserDto
	) {
		return this.usersService.update(parseInt(id), request);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}
}
