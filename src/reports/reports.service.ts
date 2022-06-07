import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Report) private readonly reportRepository: Repository<Report>
		) {}

	async create(reportDto: CreateReportDto): Promise<Report | null> {
		const report = await this.reportRepository.create(reportDto);

		return this.reportRepository.save(report)
	}
}
