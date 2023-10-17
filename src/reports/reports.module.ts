import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({ secret: 'my-secret-token', signOptions: { expiresIn: '3d' } }),
    TypeOrmModule.forFeature([Report]),
    UsersModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService, JwtService]
})
export class ReportsModule { }
