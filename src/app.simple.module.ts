import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env', 
    }),
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppSimpleModule {}