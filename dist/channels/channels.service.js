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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("./entities/channel.entity");
let ChannelsService = class ChannelsService {
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }
    async create(userId, createChannelDto) {
        const existingChannel = await this.channelRepository.findOne({
            where: { handle: createChannelDto.handle },
        });
        if (existingChannel) {
            throw new common_1.ConflictException('Channel handle already exists');
        }
        const channel = this.channelRepository.create({
            ...createChannelDto,
            userId,
        });
        return await this.channelRepository.save(channel);
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [channels, total] = await this.channelRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { subscribersCount: 'DESC' },
            relations: ['user'],
        });
        return {
            channels,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByUser(userId) {
        return await this.channelRepository.find({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const channel = await this.channelRepository.findOne({
            where: { id },
            relations: ['user', 'videos'],
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        return channel;
    }
    async findByHandle(handle) {
        const channel = await this.channelRepository.findOne({
            where: { handle },
            relations: ['user'],
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        return channel;
    }
    async update(id, userId, updateChannelDto) {
        const channel = await this.findOne(id);
        if (channel.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own channels');
        }
        if (channel.isSuspended) {
            throw new common_1.ForbiddenException('Cannot update suspended channel');
        }
        Object.assign(channel, updateChannelDto);
        return await this.channelRepository.save(channel);
    }
    async remove(id, userId) {
        const channel = await this.findOne(id);
        if (channel.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own channels');
        }
        channel.isActive = false;
        await this.channelRepository.save(channel);
    }
    async getUserChannelCount(userId) {
        return await this.channelRepository.count({
            where: { userId, isActive: true },
        });
    }
    async suspendChannel(id, reason) {
        const channel = await this.findOne(id);
        channel.isSuspended = true;
        channel.suspensionReason = reason;
        return await this.channelRepository.save(channel);
    }
    async unsuspendChannel(id) {
        const channel = await this.findOne(id);
        channel.isSuspended = false;
        channel.suspensionReason = null;
        return await this.channelRepository.save(channel);
    }
    async deleteChannelPermanently(id) {
        const channel = await this.channelRepository.findOne({
            where: { id },
            relations: ['videos'],
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found');
        }
        if (channel.videos && channel.videos.length > 0) {
            await this.channelRepository
                .createQueryBuilder()
                .relation(channel_entity_1.Channel, 'videos')
                .of(channel)
                .loadMany()
                .then(async (videos) => {
                for (const video of videos) {
                    video.channelId = null;
                }
            });
            await this.channelRepository.query('UPDATE videos SET "channelId" = NULL WHERE "channelId" = $1', [id]);
        }
        const result = await this.channelRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Channel not found');
        }
    }
    async getAllChannelsForAdmin(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [channels, total] = await this.channelRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['user', 'videos'],
            select: {
                id: true,
                name: true,
                handle: true,
                description: true,
                avatar: true,
                banner: true,
                userId: true,
                subscribersCount: true,
                videosCount: true,
                totalViews: true,
                isSuspended: true,
                suspensionReason: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        });
        return {
            channels,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getChannelStats() {
        const totalChannels = await this.channelRepository.count();
        const activeChannels = await this.channelRepository.count({ where: { isActive: true } });
        const suspendedChannels = await this.channelRepository.count({ where: { isSuspended: true } });
        return {
            totalChannels,
            activeChannels,
            suspendedChannels,
        };
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map