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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const videos_service_1 = require("./videos.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const update_video_dto_1 = require("./dto/update-video.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const fs = require("fs");
const path = require("path");
const logger_util_1 = require("../common/utils/logger.util");
let VideosController = class VideosController {
    constructor(videosService) {
        this.videosService = videosService;
    }
    async uploadVideo(files, createVideoDto, req) {
        if (!files.video || files.video.length === 0) {
            throw new common_1.BadRequestException('Video file is required');
        }
        const videoFile = files.video[0];
        const thumbnailFile = files.thumbnail?.[0];
        const video = await this.videosService.create(createVideoDto, videoFile, req.user.id, thumbnailFile);
        return {
            message: 'Video uploaded successfully',
            video: {
                id: video.id,
                title: video.title,
                description: video.description,
                visibility: video.visibility,
                filename: video.filename,
                originalName: video.originalName,
                size: video.size,
                thumbnail: video.thumbnail,
                createdAt: video.createdAt,
            },
        };
    }
    async testAuth(req) {
        return {
            message: 'Authentication successful',
            user: req.user,
            timestamp: new Date().toISOString()
        };
    }
    async findAll(req) {
        const userId = req.user?.id;
        return this.videosService.findAll(userId);
    }
    async searchVideos(query) {
        if (!query) {
            return [];
        }
        return this.videosService.searchVideos(query);
    }
    async getTrending() {
        return this.videosService.findTrending();
    }
    async getByCategory(category) {
        return this.videosService.findByCategory(category);
    }
    async getAllShorts(req) {
        const userId = req.user?.id;
        return this.videosService.findAllShorts(userId);
    }
    async getTrendingShorts() {
        return this.videosService.findTrendingShorts();
    }
    async markAsShort(id, req) {
        return this.videosService.markAsShort(id, req.user.id);
    }
    async debugShorts() {
        try {
            const allVideos = await this.videosService.findAll();
            const shorts = await this.videosService.findAllShorts();
            return {
                totalVideos: allVideos.length,
                totalShorts: shorts.length,
                allVideos: allVideos.map(v => ({
                    id: v.id,
                    title: v.title,
                    isShort: v.isShort,
                    duration: v.duration,
                    visibility: v.visibility
                })),
                shorts: shorts.map(v => ({
                    id: v.id,
                    title: v.title,
                    isShort: v.isShort,
                    duration: v.duration,
                    visibility: v.visibility
                }))
            };
        }
        catch (error) {
            return {
                error: error.message,
                message: 'Debug endpoint failed'
            };
        }
    }
    async markAllAsShorts() {
        try {
            const allVideos = await this.videosService.findAll();
            let updatedCount = 0;
            for (const video of allVideos) {
                if (!video.isShort && (video.duration === null || video.duration <= 60)) {
                    await this.videosService.markAsShort(video.id, video.userId);
                    updatedCount++;
                }
            }
            const shorts = await this.videosService.findAllShorts();
            return {
                message: `Marked ${updatedCount} videos as shorts`,
                totalShorts: shorts.length,
                updatedVideos: updatedCount
            };
        }
        catch (error) {
            return {
                error: error.message,
                message: 'Failed to mark videos as shorts'
            };
        }
    }
    async findMyVideos(req) {
        return this.videosService.findUserVideos(req.user.id);
    }
    async findOne(id, req) {
        const userId = req.user?.id;
        return this.videosService.findOne(id, userId);
    }
    async streamVideo(id, req, res) {
        const userId = req.user?.id;
        const video = await this.videosService.findOne(id, userId);
        const filePath = path.join(process.cwd(), 'uploads', 'videos', video.filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.BadRequestException('Video file not found');
        }
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            file.on('error', (error) => {
                logger_util_1.StreamLogger.logStreamError(error, 'Video Stream (Range)');
            });
            req.on('close', () => {
                if (!file.destroyed) {
                    file.destroy();
                }
            });
            req.on('aborted', () => {
                if (!file.destroyed) {
                    file.destroy();
                }
            });
            res.set({
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': video.mimeType,
            });
            res.status(206);
            return new common_1.StreamableFile(file);
        }
        else {
            const file = fs.createReadStream(filePath);
            file.on('error', (error) => {
                logger_util_1.StreamLogger.logStreamError(error, 'Video Stream (Full)');
            });
            req.on('close', () => {
                if (!file.destroyed) {
                    file.destroy();
                }
            });
            req.on('aborted', () => {
                if (!file.destroyed) {
                    file.destroy();
                }
            });
            res.set({
                'Content-Type': video.mimeType,
                'Content-Length': fileSize,
                'Accept-Ranges': 'bytes',
            });
            return new common_1.StreamableFile(file);
        }
    }
    async getThumbnail(id, req, res) {
        const userId = req.user?.id;
        const video = await this.videosService.findOne(id, userId);
        if (!video.thumbnail) {
            throw new common_1.BadRequestException('No thumbnail available for this video');
        }
        const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', video.thumbnail);
        if (!fs.existsSync(thumbnailPath)) {
            throw new common_1.BadRequestException('Thumbnail file not found');
        }
        const file = fs.createReadStream(thumbnailPath);
        const stat = fs.statSync(thumbnailPath);
        file.on('error', (error) => {
            logger_util_1.StreamLogger.logStreamError(error, 'Thumbnail Stream');
        });
        req.on('close', () => {
            if (!file.destroyed) {
                file.destroy();
            }
        });
        req.on('aborted', () => {
            if (!file.destroyed) {
                file.destroy();
            }
        });
        const ext = path.extname(video.thumbnail).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png')
            contentType = 'image/png';
        else if (ext === '.gif')
            contentType = 'image/gif';
        else if (ext === '.webp')
            contentType = 'image/webp';
        res.set({
            'Content-Type': contentType,
            'Content-Length': stat.size,
            'Cache-Control': 'public, max-age=31536000',
        });
        return new common_1.StreamableFile(file);
    }
    async update(id, updateVideoDto, req) {
        return this.videosService.update(id, updateVideoDto, req.user.id);
    }
    async remove(id, req) {
        await this.videosService.remove(id, req.user.id);
        return { message: 'Video deleted successfully' };
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                let uploadPath;
                if (file.fieldname === 'video') {
                    uploadPath = path.join(process.cwd(), 'uploads', 'videos');
                }
                else if (file.fieldname === 'thumbnail') {
                    uploadPath = path.join(process.cwd(), 'uploads', 'thumbnails');
                }
                else {
                    return cb(new common_1.BadRequestException('Invalid file field'), '');
                }
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
                cb(null, true);
            }
            else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException(`Invalid file type for ${file.fieldname}`), false);
            }
        },
        limits: {
            fileSize: 2 * 1024 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_video_dto_1.CreateVideoDto, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Get)('test-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "testAuth", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "searchVideos", null);
__decorate([
    (0, common_1.Get)('trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)('shorts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getAllShorts", null);
__decorate([
    (0, common_1.Get)('shorts/trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getTrendingShorts", null);
__decorate([
    (0, common_1.Patch)(':id/mark-as-short'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "markAsShort", null);
__decorate([
    (0, common_1.Get)('debug/shorts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "debugShorts", null);
__decorate([
    (0, common_1.Post)('debug/mark-all-shorts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "markAllAsShorts", null);
__decorate([
    (0, common_1.Get)('my-videos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findMyVideos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stream'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "streamVideo", null);
__decorate([
    (0, common_1.Get)(':id/thumbnail'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getThumbnail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_dto_1.UpdateVideoDto, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "remove", null);
exports.VideosController = VideosController = __decorate([
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map