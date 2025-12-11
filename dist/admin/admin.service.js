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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const video_entity_1 = require("../videos/entities/video.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const view_entity_1 = require("../views/entities/view.entity");
const channel_entity_1 = require("../channels/entities/channel.entity");
const bcrypt = require("bcryptjs");
let AdminService = class AdminService {
    constructor(userRepository, videoRepository, commentRepository, viewRepository, channelRepository) {
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.commentRepository = commentRepository;
        this.viewRepository = viewRepository;
        this.channelRepository = channelRepository;
    }
    async getDashboardStats() {
        const [totalUsers, totalVideos, totalComments, totalViews, totalChannels] = await Promise.all([
            this.userRepository.count(),
            this.videoRepository.count(),
            this.commentRepository.count(),
            this.viewRepository.count(),
            this.channelRepository.count(),
        ]);
        const recentUsers = await this.userRepository.count({
            where: {
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
        });
        const activeChannels = await this.channelRepository.count({
            where: { isActive: true },
        });
        return {
            totalUsers,
            totalVideos,
            totalComments,
            totalViews,
            totalChannels,
            activeChannels,
            recentUsers,
        };
    }
    async getAllUsers(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = search ? { name: (0, typeorm_2.Like)(`%${search}%`) } : {};
        const [users, total] = await this.userRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            select: ['id', 'name', 'email', 'role', 'isBanned', 'createdAt'],
        });
        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUserDetails(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['videos'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const videoCount = user.videos?.length || 0;
        const totalViews = user.videos?.reduce((sum, video) => sum + (video.views || 0), 0);
        return {
            ...user,
            videoCount,
            totalViews,
        };
    }
    async banUser(id, reason) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isBanned = true;
        await this.userRepository.save(user);
        return { message: 'User banned successfully', user };
    }
    async unbanUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isBanned = false;
        await this.userRepository.save(user);
        return { message: 'User unbanned successfully', user };
    }
    async updateUserRole(id, role) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.role = role;
        await this.userRepository.save(user);
        return { message: 'User role updated successfully', user };
    }
    async deleteUser(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('User not found');
        }
        return { message: 'User deleted successfully' };
    }
    async getAllVideos(page, limit, status) {
        const skip = (page - 1) * limit;
        const [videos, total] = await this.videoRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
        return {
            videos,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async featureVideo(id) {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        video.isFeatured = !video.isFeatured;
        await this.videoRepository.save(video);
        return { message: 'Video featured status updated', video };
    }
    async suspendVideo(id, reason) {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        video.isSuspended = true;
        video.suspensionReason = reason || 'Suspended by admin';
        await this.videoRepository.save(video);
        return { message: 'Video suspended successfully', video };
    }
    async unsuspendVideo(id) {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        video.isSuspended = false;
        video.suspensionReason = null;
        await this.videoRepository.save(video);
        return { message: 'Video unsuspended successfully', video };
    }
    async deleteVideo(id) {
        const result = await this.videoRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Video not found');
        }
        return { message: 'Video deleted successfully' };
    }
    async getAllComments(page, limit) {
        const skip = (page - 1) * limit;
        const [comments, total] = await this.commentRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['user', 'video'],
        });
        return {
            comments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async deleteComment(id) {
        const result = await this.commentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return { message: 'Comment deleted successfully' };
    }
    async getAnalytics(period) {
        const days = period === '30d' ? 30 : 7;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const newUsers = await this.userRepository.count({
            where: { createdAt: startDate },
        });
        const newVideos = await this.videoRepository.count({
            where: { createdAt: startDate },
        });
        return {
            period,
            newUsers,
            newVideos,
        };
    }
    async createAdmin(name, email, password) {
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const admin = this.userRepository.create({
            name,
            email,
            password,
            role: 'admin',
            isEmailVerified: true,
        });
        await this.userRepository.save(admin);
        return {
            message: 'Admin created successfully',
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };
    }
    async changeUserPassword(id, newPassword) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return {
            message: 'Password changed successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(3, (0, typeorm_1.InjectRepository)(view_entity_1.View)),
    __param(4, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map