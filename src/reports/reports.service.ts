import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
	constructor(
		@InjectRepository(Report) private readonly reportRepository: Repository<Report>
		) {}

	async createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
		return await this.reportRepository.createQueryBuilder()
			.select('AVG(price)', 'price')
			.where('make = :make', { make })
			.andWhere('model = :model', { model })
			.andWhere('lat - :lat BETWEEN -5 and 5', { lat })
			.andWhere('lng - :lng BETWEEN -5 and 5', { lng })
			.andWhere('year - :year BETWEEN -3 and 3', { year })
			.andWhere('approved IS TRUE')
			.orderBy('ABS(mileage - :mileage)', 'DESC')
			.setParameters({ mileage })
			.limit(3)
			.getRawOne();
	}

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
