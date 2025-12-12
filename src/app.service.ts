import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      message: 'NebulaStream API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  getHealthCheck() {
    return {
      status: 'healthy',
      service: 'NebulaStream Backend',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      routes: 'working'
    };
  }

  getApiHealth() {
    return {
      status: 'OK',
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}