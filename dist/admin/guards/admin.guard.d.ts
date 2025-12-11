import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class AdminGuard implements CanActivate {
    private userRepository;
    constructor(userRepository: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
