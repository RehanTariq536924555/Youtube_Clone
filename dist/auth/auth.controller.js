"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const users_service_1 = require("../users/users.service");
const email_verified_guard_1 = require("./guards/email-verified.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async register(createUserDto) {
        try {
            const user = await this.authService.register(createUserDto);
            const message = user.isEmailVerified
                ? 'User registered successfully and email auto-verified for development. You can now login.'
                : 'User registered successfully. Please check your email to verify your account.';
            return {
                message,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            };
        }
        catch (error) {
            if (error.status === 409) {
                return {
                    error: 'Registration failed',
                    message: error.message,
                    statusCode: 409
                };
            }
            throw error;
        }
    }
    async login(req) {
        if (!req.user.isEmailVerified) {
            return {
                error: 'Email not verified',
                message: 'Please verify your email before logging in. Check your inbox for the verification link.',
                statusCode: 403
            };
        }
        return this.authService.login(req.user);
    }
    async verifyEmail(token) {
        const user = await this.usersService.verifyEmail(token);
        if (user) {
            return {
                message: 'Email verified successfully',
                redirectUrl: `${process.env.FRONTEND_URL}/profile`,
            };
        }
        else {
            return { message: 'Invalid or expired verification token' };
        }
    }
    async getProtectedData() {
        return { data: 'This is protected data' };
    }
    async testEmail(body) {
        try {
            await this.usersService.testEmailService(body.email);
            return { message: 'Test email sent successfully' };
        }
        catch (error) {
            return { error: 'Failed to send test email', details: error.message };
        }
    }
    async manualVerifyEmail(body) {
        try {
            const user = await this.usersService.findByEmail(body.email);
            if (!user) {
                return { error: 'User not found' };
            }
            if (user.isEmailVerified) {
                return { message: 'Email is already verified' };
            }
            user.isEmailVerified = true;
            user.emailVerificationToken = null;
            await this.usersService.manualVerifyUser(user);
            return { message: 'Email verified manually for development' };
        }
        catch (error) {
            return { error: 'Failed to verify email manually', details: error.message };
        }
    }
    async getCurrentUser(req) {
        try {
            const user = await this.usersService.findById(req.user.sub);
            if (!user) {
                return { error: 'User not found' };
            }
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    googleId: user.googleId,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt
                }
            };
        }
        catch (error) {
            return { error: 'Failed to get user info', details: error.message };
        }
    }
    async googleAuth(req) {
    }
    async googleAuthCallback(req, res) {
        try {
            const loginResult = await this.authService.login(req.user);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const userData = {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                picture: req.user.picture,
                googleId: req.user.googleId,
                isEmailVerified: req.user.isEmailVerified
            };
            res.redirect(`${frontendUrl}/#/auth/callback?token=${loginResult.access_token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/#/auth/error?message=${encodeURIComponent('Authentication failed')}`);
        }
    }
    async googleVerifyCredential(body) {
        try {
            const { OAuth2Client } = require('google-auth-library');
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const googleId = payload['sub'];
            const email = payload['email'];
            const name = payload['name'];
            const picture = payload['picture'];
            let user = await this.usersService.findByGoogleId(googleId);
            if (!user) {
                user = await this.usersService.findByEmail(email);
                if (user) {
                    user = await this.usersService.linkGoogleAccount(user.id, googleId, picture);
                }
                else {
                    user = await this.usersService.createGoogleUser({
                        email,
                        name,
                        googleId,
                        picture,
                        isEmailVerified: true,
                    });
                }
            }
            else {
                user.name = name;
                user.picture = picture;
                await this.usersService.updateUser(user.id, { name: user.name, picture: user.picture });
            }
            const loginResult = await this.authService.login(user);
            return {
                message: 'Google authentication successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    googleId: user.googleId,
                    isEmailVerified: user.isEmailVerified
                },
                access_token: loginResult.access_token
            };
        }
        catch (error) {
            console.error('Google credential verification failed:', error);
            return {
                error: 'Google authentication failed',
                message: error.message || 'Invalid credential',
                statusCode: 400
            };
        }
    }
    async googleMockAuth(body) {
        try {
            let user = await this.usersService.findByEmail(body.email);
            if (!user) {
                user = await this.usersService.createGoogleUser({
                    email: body.email,
                    name: body.name,
                    googleId: 'mock-' + Date.now(),
                    picture: body.picture || `https://ui-avatars.com/api/?background=random&name=${body.name}`,
                    isEmailVerified: true,
                });
            }
            const loginResult = await this.authService.login(user);
            return {
                message: 'Google authentication successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    googleId: user.googleId,
                    isEmailVerified: user.isEmailVerified
                },
                access_token: loginResult.access_token
            };
        }
        catch (error) {
            return {
                error: 'Google authentication failed',
                message: error.message,
                statusCode: 400
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(),
    (0, common_1.Get)('verify-email/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, common_1.Get)('protected-route'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProtectedData", null);
__decorate([
    (0, common_1.Post)('test-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Post)('manual-verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "manualVerifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Post)('google/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleVerifyCredential", null);
__decorate([
    (0, common_1.Post)('google/mock'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleMockAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map