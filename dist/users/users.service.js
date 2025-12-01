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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_repository_1 = require("./users.repository");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const email_service_1 = require("../email/email.service");
let UsersService = class UsersService {
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    async createUser(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        try {
            const user = this.userRepository.create(createUserDto);
            user.emailVerificationToken = (0, crypto_1.randomUUID)();
            await this.userRepository.save(user);
            if (process.env.NODE_ENV === 'development' && process.env.AUTO_VERIFY_EMAIL === 'true') {
                console.log('Development mode: Auto-verifying user email (skipping email send)');
                user.isEmailVerified = true;
                user.emailVerificationToken = null;
                await this.userRepository.save(user);
                console.log(`User ${user.email} auto-verified for development`);
            }
            else {
                try {
                    await this.emailService.sendVerificationEmail(user.email, user.emailVerificationToken);
                    console.log(`Verification email sent to ${user.email}`);
                }
                catch (emailError) {
                    console.error('Failed to send verification email:', emailError);
                    throw new Error('Failed to send verification email. Please try again or contact support.');
                }
            }
            return user;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('User with this email already exists');
            }
            throw error;
        }
    }
    findAll() {
        return this.userRepository.find();
    }
    async findById(userId) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(userId, { password: hashedPassword });
    }
    async deleteUserById(userId) {
        const result = await this.userRepository.delete(userId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async validateUser(email, password) {
        const user = await this.findByEmail(email);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', isMatch);
            if (isMatch) {
                return user;
            }
        }
        return null;
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findOne({ where: { emailVerificationToken: token } });
        if (user) {
            user.isEmailVerified = true;
            user.emailVerificationToken = null;
            await this.userRepository.save(user);
            return user;
        }
        return null;
    }
    async testEmailService(email) {
        await this.emailService.sendVerificationEmail(email, 'test-token-123');
    }
    async manualVerifyUser(user) {
        return this.userRepository.save(user);
    }
    async createGoogleUser(googleData) {
        const user = this.userRepository.create({
            ...googleData,
            password: null,
        });
        return this.userRepository.save(user);
    }
    async linkGoogleAccount(userId, googleId, picture) {
        await this.userRepository.update(userId, {
            googleId,
            picture,
            isEmailVerified: true
        });
        return this.findById(userId);
    }
    async findByGoogleId(googleId) {
        return this.userRepository.findOne({ where: { googleId } });
    }
    async updateUser(userId, updateData) {
        await this.userRepository.update(userId, updateData);
        return this.findById(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UserRepository)),
    __metadata("design:paramtypes", [users_repository_1.UserRepository,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map