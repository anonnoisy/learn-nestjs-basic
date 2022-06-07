import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>
	) {}

	async create(email: string, password: string): Promise<User> {
		// Create instance for user entity
		const user = this.userRepository.create({ email, password });

		// Insert user data into database
		return this.userRepository.save(user);
	}

	async findOne(id: number): Promise<User | null> {
		if (!id) {
			return null;
		}

		return this.userRepository.findOneBy({ id: id });
	}

	async find(email: string): Promise<User[] | null> {
		return this.userRepository.findBy({email: email});
	}

	async update(id: number, attributes: Partial<User>): Promise<User | null> {
		const user: User = await this.findOne(id);
		if (!user) {
			throw new NotFoundException(`User ${id} not found`);
		}

		Object.assign(user, attributes);
		return this.userRepository.save(user);
	}

	async remove(id: number): Promise<User> {
		const user: User = await this.findOne(id);
		if (!user) {
			throw new NotFoundException(`User ${id} not found`);
		}

		return this.userRepository.remove(user);
	}
}
