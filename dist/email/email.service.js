"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    async sendVerificationEmail(email, token) {
        const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification - NebulaStream',
            text: `Please verify your email by clicking the following link: ${verificationLink}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Welcome to NebulaStream!</h2>
              <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationLink}">${verificationLink}</a>
              </p>
              <p style="color: #666; font-size: 12px;">
                This verification link will expire in 24 hours.
              </p>
            </div>
          `,
        };
        try {
            console.log('Attempting to send email to:', email);
            console.log('SMTP Config:', {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                user: process.env.EMAIL_USER,
                secure: process.env.EMAIL_SECURE
            });
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error('Error sending email:', error);
            console.error('Error details:', {
                code: error.code,
                command: error.command,
                response: error.response,
                responseCode: error.responseCode
            });
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    }
    async sendPasswordResetEmail(email, name, resetUrl) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password - NebulaStream',
            text: `Hello ${name},\n\nWe received a request to reset your password for your NebulaStream account.\n\nPlease reset your password by clicking the following link: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nNebulaStream Team`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p>Hello ${name},</p>
              <p>We received a request to reset your password for your NebulaStream account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </p>
              <p style="color: #666; font-size: 12px;">
                This password reset link will expire in 1 hour.
              </p>
              <p style="color: #666; font-size: 12px;">
                If you didn't request this password reset, please ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #999; font-size: 11px;">
                Best regards,<br>
                NebulaStream Team
              </p>
            </div>
          `,
        };
        try {
            console.log('Attempting to send password reset email to:', email);
            console.log('SMTP Config:', {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                user: process.env.EMAIL_USER,
                secure: process.env.EMAIL_SECURE
            });
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully:', info.messageId);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            console.error('Error details:', {
                code: error.code,
                command: error.command,
                response: error.response,
                responseCode: error.responseCode
            });
            throw new Error(`Failed to send password reset email: ${error.message}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map