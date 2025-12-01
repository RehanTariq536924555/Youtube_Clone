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
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_entity_1 = require("./entities/video.entity");
const fs = require("fs");
const path = require("path");
let VideosService = class VideosService {
    constructor(videosRepository) {
        this.videosRepository = videosRepository;
    }
    async create(createVideoDto, file, userId, thumbnailFile) {
        const video = this.videosRepository.create({
            ...createVideoDto,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            userId,
            visibility: createVideoDto.visibility || video_entity_1.VideoVisibility.PUBLIC,
            thumbnail: thumbnailFile ? thumbnailFile.filename : null,
            tags: createVideoDto.tags && createVideoDto.tags.length > 0 ? createVideoDto.tags : null,
            isShort: createVideoDto.isShort || false,
        });
        return this.videosRepository.save(video);
    }
    async findAll(userId) {
        const queryBuilder = this.videosRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user');
        if (userId) {
            queryBuilder.where('video.userId = :userId', { userId });
        }
        else {
            queryBuilder.where('video.visibility = :visibility', {
                visibility: video_entity_1.VideoVisibility.PUBLIC,
            });
        }
        return queryBuilder
            .orderBy('video.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id, userId) {
        const video = await this.videosRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        if (video.visibility === video_entity_1.VideoVisibility.PRIVATE && video.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return video;
    }
    async update(id, updateVideoDto, userId) {
        const video = await this.findOne(id, userId);
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own videos');
        }
        Object.assign(video, updateVideoDto);
        return this.videosRepository.save(video);
    }
    async remove(id, userId) {
        const video = await this.findOne(id, userId);
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own videos');
        }
        const filePath = path.join(process.cwd(), 'uploads', 'videos', video.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        if (video.thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', video.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }
        await this.videosRepository.remove(video);
    }
    async findUserVideos(userId) {
        return this.videosRepository.find({
            where: { userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async incrementViews(id) {
        const video = await this.findOne(id);
        video.viewsCount++;
        return this.videosRepository.save(video);
    }
    async incrementLikes(id) {
        const video = await this.findOne(id);
        video.likesCount++;
        return this.videosRepository.save(video);
    }
    async decrementLikes(id) {
        const video = await this.findOne(id);
        video.likesCount = Math.max(0, video.likesCount - 1);
        return this.videosRepository.save(video);
    }
    async incrementDislikes(id) {
        const video = await this.findOne(id);
        video.dislikesCount++;
        return this.videosRepository.save(video);
    }
    async decrementDislikes(id) {
        const video = await this.findOne(id);
        video.dislikesCount = Math.max(0, video.dislikesCount - 1);
        return this.videosRepository.save(video);
    }
    async incrementComments(id) {
        const video = await this.findOne(id);
        video.commentsCount++;
        return this.videosRepository.save(video);
    }
    async decrementComments(id) {
        const video = await this.findOne(id);
        video.commentsCount = Math.max(0, video.commentsCount - 1);
        return this.videosRepository.save(video);
    }
    async searchVideos(query) {
        return this.videosRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.visibility = :visibility', { visibility: video_entity_1.VideoVisibility.PUBLIC })
            .andWhere('(LOWER(video.title) LIKE LOWER(:query) OR LOWER(video.description) LIKE LOWER(:query) OR LOWER(video.category) LIKE LOWER(:query))', { query: `%${query.toLowerCase()}%` })
            .orderBy('video.createdAt', 'DESC')
            .getMany();
    }
    async findByCategory(category) {
        return this.videosRepository.find({
            where: {
                category,
                visibility: video_entity_1.VideoVisibility.PUBLIC
            },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findTrending() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return this.videosRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.visibility = :visibility', { visibility: video_entity_1.VideoVisibility.PUBLIC })
            .andWhere('video.createdAt >= :date', { date: sevenDaysAgo })
            .orderBy('video.viewsCount', 'DESC')
            .addOrderBy('video.likesCount', 'DESC')
            .limit(50)
            .getMany();
    }
    async findAllShorts(userId) {
        const queryBuilder = this.videosRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.isShort = :isShort', { isShort: true });
        if (userId) {
            queryBuilder.andWhere('video.userId = :userId', { userId });
        }
        else {
            queryBuilder.andWhere('video.visibility = :visibility', {
                visibility: video_entity_1.VideoVisibility.PUBLIC,
            });
        }
        return queryBuilder
            .orderBy('video.createdAt', 'DESC')
            .getMany();
    }
    async findTrendingShorts() {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return this.videosRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.isShort = :isShort', { isShort: true })
            .andWhere('video.visibility = :visibility', { visibility: video_entity_1.VideoVisibility.PUBLIC })
            .andWhere('video.createdAt >= :date', { date: threeDaysAgo })
            .orderBy('video.viewsCount', 'DESC')
            .addOrderBy('video.likesCount', 'DESC')
            .addOrderBy('video.commentsCount', 'DESC')
            .limit(100)
            .getMany();
    }
    async markAsShort(id, userId) {
        const video = await this.findOne(id, userId);
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('You can only modify your own videos');
        }
        video.isShort = true;
        return this.videosRepository.save(video);
    }
    async autoDetectShorts() {
        await this.videosRepository
            .createQueryBuilder()
            .update(video_entity_1.Video)
            .set({ isShort: true })
            .where('duration <= :maxDuration', { maxDuration: 60 })
            .andWhere('isShort = :isShort', { isShort: false })
            .execute();
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VideosService);
//# sourceMappingURL=videos.service.js.map