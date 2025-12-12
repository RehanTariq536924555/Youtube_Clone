"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const stream_exception_filter_1 = require("./common/filters/stream-exception.filter");
async function bootstrap() {
    try {
        console.log('Starting NestJS application...');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Port:', process.env.PORT);
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('Application created successfully');
        const configService = app.get(config_1.ConfigService);
        const port = process.env.PORT || configService.get('PORT') || 4000;
        const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
        console.log('Configuring CORS...');
        app.enableCors({
            origin: [
                frontendUrl,
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://youtube-clone-frontend-livid.vercel.app',
                'https://youtube-clone-1-ntn4.onrender.com'
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
            optionsSuccessStatus: 200
        });
        console.log('Configuring body parser for large files...');
        app.use(require('express').json({ limit: '2gb' }));
        app.use(require('express').urlencoded({ limit: '2gb', extended: true }));
        console.log('Setting up validation pipes...');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        console.log('Setting up global exception filters...');
        app.useGlobalFilters(new stream_exception_filter_1.StreamExceptionFilter());
        app.use((req, res, next) => {
            if (req.url === '/' && (req.method === 'HEAD' || req.method === 'GET')) {
                console.log(`Health check request: ${req.method} ${req.url}`);
            }
            next();
        });
        console.log(`Starting server on port ${port}...`);
        await app.listen(port, '0.0.0.0');
        console.log(`🚀 Application is running on: http://localhost:${port}`);
        console.log(`🌐 Health check available at: http://localhost:${port}/health`);
    }
    catch (error) {
        console.error('❌ Error starting application:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    if (reason && typeof reason === 'object' && 'code' in reason) {
        const ignoredErrors = [
            'ERR_STREAM_PREMATURE_CLOSE',
            'ECONNRESET',
            'ECONNABORTED',
            'EPIPE'
        ];
        if (ignoredErrors.includes(reason.code)) {
            return;
        }
    }
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    const ignoredErrors = [
        'ERR_STREAM_PREMATURE_CLOSE',
        'ECONNRESET',
        'ECONNABORTED',
        'EPIPE'
    ];
    if (error.code && ignoredErrors.includes(error.code)) {
        return;
    }
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=main.js.map