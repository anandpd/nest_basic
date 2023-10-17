import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/users/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportService: ReportsService) { }

    @Get()
    test() {
        return { route: '/reports', method: 'get' }
    }

    @Post()
    @UseGuards(AuthGuard)
    async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        const report = await this.reportService.create(body, user);
        return {
            success: true,
            data: report
        }
    }

}
