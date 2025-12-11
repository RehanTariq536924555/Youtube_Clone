import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import { EmailService } from '../email/email.service';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string | number>('jwt.expirationTime'),
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, UsersService, UserRepository, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
