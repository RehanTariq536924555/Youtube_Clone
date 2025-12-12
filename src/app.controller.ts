import { Controller, Get, Head, Res, Logger, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';

@Controller('')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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

  @Post('bootstrap/promote-to-admin')
  async promoteToAdmin(@Body('email') email: string) {
    this.logger.log('Bootstrap promote to admin endpoint accessed');
    
    try {
      // Check if any admin user already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { role: 'admin' },
      });

      if (existingAdmin) {
        return {
          error: 'Admin user already exists. Cannot promote another user.',
          statusCode: 400
        };
      }

      // Find the user to promote
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return {
          error: 'User not found',
          statusCode: 404
        };
      }

      // Promote user to admin
      user.role = 'admin';
      user.isEmailVerified = true;
      await this.userRepository.save(user);

      return {
        message: 'User promoted to admin successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error('Error promoting user to admin:', error);
      return {
        error: 'Failed to promote user to admin',
        message: error.message,
        statusCode: 500
      };
    }
  }

  @Post('bootstrap/set-password')
  async setUserPassword(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    this.logger.log('Bootstrap set password endpoint accessed');
    
    try {
      // Find the user
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return {
          error: 'User not found',
          statusCode: 404
        };
      }

      // Hash and set the password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.isEmailVerified = true;
      await this.userRepository.save(user);

      return {
        message: 'Password set successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          hasPassword: !!user.password,
        },
      };
    } catch (error) {
      this.logger.error('Error setting user password:', error);
      return {
        error: 'Failed to set password',
        message: error.message,
        statusCode: 500
      };
    }
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