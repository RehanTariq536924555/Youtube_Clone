export declare class EmailService {
    private transporter;
    sendVerificationEmail(email: string, token: string): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<{
        success: boolean;
        messageId: any;
    }>;
}
