import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class TestController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('health')
  getHealth(): object {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}

@Module({
  controllers: [TestController],
})
class TestModule {}

async function bootstrap() {
  try {
    console.log('🚀 Starting minimal NestJS server...');
    
    const app = await NestFactory.create(TestModule);
    
    app.enableCors();
    
    const port = 4000;
    await app.listen(port);
    
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ Health check: http://localhost:${port}/health`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

bootstrap();