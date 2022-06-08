import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Report) private readonly reportRepository: Repository<Report>
		) {}

	async create(reportDto: CreateReportDto, user: User): Promise<Report | null> {
		const report = await this.reportRepository.create(reportDto);
		report.user = user;
		return this.reportRepository.save(report)
	}
}
