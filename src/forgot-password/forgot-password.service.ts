import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';


@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService, 
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return { message: 'If an account with that email exists, we have sent a password reset link.' };
    }

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '1h' });
    const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${token}`;

    try {
      await this.emailService.sendPasswordResetEmail(email, user.name, resetUrl);
      return { message: 'Password reset email sent successfully.' };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      // For debugging, let's throw the actual error instead of hiding it
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
