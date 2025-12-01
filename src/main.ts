import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { StreamExceptionFilter } from './common/filters/stream-exception.filter';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');

    const app = await NestFactory.create(AppModule);
    console.log('Application created successfully');

    const configService = app.get(ConfigService);
    const port = process.env.PORT || configService.get<number>('PORT') || 4000;
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    console.log('Configuring CORS...');
    app.enableCors({
      origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    // Increase body size limit for large video uploads (2GB)
    console.log('Configuring body parser for large files...');
    app.use(require('express').json({ limit: '2gb' }));
    app.use(require('express').urlencoded({ limit: '2gb', extended: true }));

    console.log('Setting up validation pipes...');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    console.log('Setting up global exception filters...');
    app.useGlobalFilters(new StreamExceptionFilter());

    console.log(`Starting server on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  // Ignore common streaming errors at process level
  if (reason && typeof reason === 'object' && 'code' in reason) {
    const ignoredErrors = [
      'ERR_STREAM_PREMATURE_CLOSE',
      'ECONNRESET',
      'ECONNABORTED',
      'EPIPE'
    ];

    if (ignoredErrors.includes((reason as any).code)) {
      return; // Silently ignore these errors
    }
  }

  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: Error & { code?: string }) => {
  // Ignore common streaming errors at process level
  const ignoredErrors = [
    'ERR_STREAM_PREMATURE_CLOSE',
    'ECONNRESET',
    'ECONNABORTED',
    'EPIPE'
  ];

  if (error.code && ignoredErrors.includes(error.code)) {
    return; // Silently ignore these errors
  }

  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
