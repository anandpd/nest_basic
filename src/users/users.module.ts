import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUserInterceptor } from './interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  // creates repo
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: 'my-secret-token', signOptions: { expiresIn: '3d' } })
  ],
  controllers: [
    UsersController
  ],

  // Dependencies
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor
    }
  ],
  exports: [
    UsersService,
    AuthService
  ]
})
export class UsersModule { }
