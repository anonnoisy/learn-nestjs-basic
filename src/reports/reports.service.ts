import { Injectable, NotFoundException } from '@nestjs/common';
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

	async changeApproval(id: number, approved: boolean): Promise<Report> {
		const report = await this.reportRepository.findOneBy({ id });
		if (!report) {
			throw new NotFoundException('report not found');
		}

		report.approved = approved;
		return await this.reportRepository.save(report);
	}
}
