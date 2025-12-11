"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_simple_module_1 = require("./app.simple.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    try {
        console.log('🚀 Starting NestJS application (minimal mode)...');
        const app = await core_1.NestFactory.create(app_simple_module_1.AppSimpleModule);
        console.log('✅ Application created successfully');
        const configService = app.get(config_1.ConfigService);
        const port = process.env.PORT || configService.get('PORT') || 4000;
        const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
        console.log('🔧 Configuring CORS...');
        app.enableCors({
            origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });
        console.log('🔧 Setting up validation pipes...');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.getHttpAdapter().get('/', (req, res) => {
            res.json({
                message: 'YouTube Clone Backend is running!',
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });
        app.getHttpAdapter().get('/health', (req, res) => {
            res.json({
                status: 'ok',
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            });
        });
        console.log(`🚀 Starting server on port ${port}...`);
        await app.listen(port, '0.0.0.0');
        console.log(`✅ Application is running on: http://localhost:${port}`);
        console.log(`🌐 Health check: http://localhost:${port}/health`);
    }
    catch (error) {
        console.error('❌ Error starting application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.minimal.js.map