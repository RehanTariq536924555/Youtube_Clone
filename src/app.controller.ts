import { Controller, Get, Head, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      message: 'NebulaStream API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Head()
  headHealth(@Res() res: Response) {
    res.status(200).end();
  }

  @Get('health')
  getHealthCheck() {
    return {
      status: 'healthy',
      service: 'NebulaStream Backend',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Head('health')
  headHealthCheck(@Res() res: Response) {
    res.status(200).end();
  }

  @Get('favicon.ico')
  getFavicon(@Res() res: Response) {
    res.status(204).end(); // No content for favicon
  }

  @Head('favicon.ico')
  headFavicon(@Res() res: Response) {
    res.status(204).end();
  }
}