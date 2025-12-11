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
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { ChannelsModule } from './channels/channels.module';
import { PlaylistsModule } from './playlists/playlists.module';


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
        console.log('- NODE_ENV:', process.env.NODE_ENV);
        console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
        console.log('- DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET');
        
        // Check if DATABASE_URL is provided (common on Render)
        const databaseUrl = process.env.DATABASE_URL;
        if (databaseUrl) {
          console.log('- Using DATABASE_URL connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: true,
            logging: false,
            retryAttempts: 3,
            retryDelay: 3000,
            dropSchema: false,
            migrationsRun: false,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          };
        }
        
        // Fallback to individual environment variables
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
          dropSchema: false,
          migrationsRun: false,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
    AdminModule,
    SettingsModule,
    ChannelsModule,
    PlaylistsModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
