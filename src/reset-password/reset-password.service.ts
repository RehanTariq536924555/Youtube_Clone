import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await this.usersService.updatePassword(userId, newPassword);
      
      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new Error('Invalid or expired reset token');
      }
      throw error;
    }
  }
}

