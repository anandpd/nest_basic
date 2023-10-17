import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private readonly repository: Repository<Report>) { }

    async create(data: CreateReportDto, user: User): Promise<Report> {
        const report = this.repository.create(data);
        report.user = user;
        return await this.repository.save(report);
    }
}
