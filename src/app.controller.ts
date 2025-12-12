import { Controller, Get, Head, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    this.logger.log('Root GET request received');
    return this.appService.getHealth();
  }

  @Head()
  headHealth(@Res() res: Response) {
    this.logger.log('Root HEAD request received');
    res.status(200).end();
  }

  @Get('health')
  getHealthCheck() {
    this.logger.log('Health check endpoint accessed');
    return this.appService.getHealthCheck();
  }

  @Head('health')
  headHealthCheck(@Res() res: Response) {
    this.logger.log('Health check HEAD request received');
    res.status(200).end();
  }

  @Get('api/health')
  getApiHealth() {
    this.logger.log('API health check endpoint accessed');
    return this.appService.getApiHealth();
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