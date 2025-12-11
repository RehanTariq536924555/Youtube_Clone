import { NestFactory } from '@nestjs/core';
import { AppSimpleModule } from './app.simple.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application (minimal mode)...');

    const app = await NestFactory.create(AppSimpleModule);
    console.log('✅ Application created successfully');

    const configService = app.get(ConfigService);
    const port = process.env.PORT || configService.get<number>('PORT') || 4000;
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    console.log('🔧 Configuring CORS...');
    app.enableCors({
      origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    console.log('🔧 Setting up validation pipes...');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Add a simple health check endpoint
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
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();