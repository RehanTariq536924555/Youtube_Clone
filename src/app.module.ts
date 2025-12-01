import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EmailService } from './email/email.service';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { VideosModule } from './videos/videos.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ViewsModule } from './views/views.module';
import { WatchLaterModule } from './watch-later/watch-later.module';
import { DownloadsModule } from './downloads/downloads.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('🔧 Database Configuration:');
        console.log('- Host:', configService.get('database.host'));
        console.log('- Port:', configService.get('database.port'));
        console.log('- Database:', configService.get('database.database'));
        console.log('- Username:', configService.get('database.username'));
        
        return {
          type: 'postgres',
          host: configService.get('database.host') || 'localhost',
          port: configService.get<number>('database.port') || 5432,
          username: configService.get('database.username') || 'postgres',
          password: configService.get('database.password') || '',
          database: configService.get('database.database') || 'YoutubeClone',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          retryAttempts: 3,
          retryDelay: 3000,
          dropSchema: false, // Don't drop existing schema
          migrationsRun: false, // Don't run migrations automatically
        };
      },
    }),
    AuthModule,
    UsersModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    VideosModule,
    CommentsModule,
    LikesModule,
    SubscriptionsModule,
    ViewsModule,
    WatchLaterModule,
    DownloadsModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
