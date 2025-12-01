import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class ResetPasswordController {
    private readonly resetPasswordService;
    constructor(resetPasswordService: ResetPasswordService);
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
