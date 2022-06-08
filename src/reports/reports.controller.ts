import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Get()
	@UseGuards(AuthGuard)
	async getEstimate(@Query() query: GetEstimateDto) {
		return await this.reportsService.createEstimate(query);
	}

	@Post()
	@UseGuards(AuthGuard)
	@Serialize(ReportDto)
	async createReport(@Body() request: CreateReportDto, @CurrentUser() user: User) {
		return await this.reportsService.create(request, user);
	}

	@Patch('/:id')
	@UseGuards(AuthGuard, AdminGuard)
	async approveReport(@Param('id') id: string, @Body() request: ApproveReportDto) {
		return await this.reportsService.changeApproval(parseInt(id), request.approved);
	}
}
