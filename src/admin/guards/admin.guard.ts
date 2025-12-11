import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    // Fetch fresh user data from database to get current role
    const dbUser = await this.userRepository.findOne({ 
      where: { id: user.id },
      select: ['id', 'email', 'role', 'isBanned']
    });
    
    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }
    
    if (dbUser.isBanned) {
      throw new UnauthorizedException('User is banned');
    }
    
    if (dbUser.role !== 'admin') {
      throw new UnauthorizedException('Admin privileges required');
    }
    
    // Attach full user data to request for use in controllers
    request.user = dbUser;
    
    return true;
  }
}
