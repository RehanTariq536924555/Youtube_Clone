"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const email_service_1 = require("./email/email.service");
const forgot_password_module_1 = require("./forgot-password/forgot-password.module");
const reset_password_module_1 = require("./reset-password/reset-password.module");
const videos_module_1 = require("./videos/videos.module");
const comments_module_1 = require("./comments/comments.module");
const likes_module_1 = require("./likes/likes.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const views_module_1 = require("./views/views.module");
const watch_later_module_1 = require("./watch-later/watch-later.module");
const downloads_module_1 = require("./downloads/downloads.module");
const admin_module_1 = require("./admin/admin.module");
const settings_module_1 = require("./settings/settings.module");
const channels_module_1 = require("./channels/channels.module");
const playlists_module_1 = require("./playlists/playlists.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    console.log('🔧 Database Configuration:');
                    console.log('- NODE_ENV:', process.env.NODE_ENV);
                    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
                    console.log('- DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET');
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
                    console.log('- Host:', configService.get('database.host'));
                    console.log('- Port:', configService.get('database.port'));
                    console.log('- Database:', configService.get('database.database'));
                    console.log('- Username:', configService.get('database.username'));
                    return {
                        type: 'postgres',
                        host: configService.get('database.host') || 'localhost',
                        port: configService.get('database.port') || 5432,
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
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            forgot_password_module_1.ForgotPasswordModule,
            reset_password_module_1.ResetPasswordModule,
            videos_module_1.VideosModule,
            comments_module_1.CommentsModule,
            likes_module_1.LikesModule,
            subscriptions_module_1.SubscriptionsModule,
            views_module_1.ViewsModule,
            watch_later_module_1.WatchLaterModule,
            downloads_module_1.DownloadsModule,
            admin_module_1.AdminModule,
            settings_module_1.SettingsModule,
            channels_module_1.ChannelsModule,
            playlists_module_1.PlaylistsModule,
        ],
        providers: [app_service_1.AppService, email_service_1.EmailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map