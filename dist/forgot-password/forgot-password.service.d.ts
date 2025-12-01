import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
export declare class ForgotPasswordService {
    private readonly usersService;
    private readonly jwtService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService);
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
}
