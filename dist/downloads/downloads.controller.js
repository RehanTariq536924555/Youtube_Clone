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
exports.DownloadsController = void 0;
const common_1 = require("@nestjs/common");
const downloads_service_1 = require("./downloads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const videos_service_1 = require("../videos/videos.service");
const fs_1 = require("fs");
const path_1 = require("path");
let DownloadsController = class DownloadsController {
    constructor(downloadsService, videosService) {
        this.downloadsService = downloadsService;
        this.videosService = videosService;
    }
    async recordDownload(req, videoId) {
        const userId = req.user.id;
        await this.downloadsService.recordDownload(userId, videoId);
        return { message: 'Download recorded' };
    }
    async getDownloads(req) {
        const userId = req.user.id;
        return this.downloadsService.getDownloads(userId);
    }
    async removeDownload(req, videoId) {
        const userId = req.user.id;
        await this.downloadsService.removeDownload(userId, videoId);
        return { message: 'Download removed from history' };
    }
    async getDownloadCount(req) {
        const userId = req.user.id;
        const count = await this.downloadsService.getDownloadCount(userId);
        return { count };
    }
    async downloadVideo(req, videoId, res) {
        const userId = req.user.id;
        const video = await this.videosService.findOne(videoId);
        await this.downloadsService.recordDownload(userId, videoId);
        res.set({
            'Content-Type': video.mimeType,
            'Content-Disposition': `attachment; filename="${video.originalName}"`,
        });
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'videos', video.filename);
        const file = (0, fs_1.createReadStream)(filePath);
        return new common_1.StreamableFile(file);
    }
};
exports.DownloadsController = DownloadsController;
__decorate([
    (0, common_1.Post)('record/:videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DownloadsController.prototype, "recordDownload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DownloadsController.prototype, "getDownloads", null);
__decorate([
    (0, common_1.Delete)(':videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DownloadsController.prototype, "removeDownload", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DownloadsController.prototype, "getDownloadCount", null);
__decorate([
    (0, common_1.Get)('file/:videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DownloadsController.prototype, "downloadVideo", null);
exports.DownloadsController = DownloadsController = __decorate([
    (0, common_1.Controller)('downloads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [downloads_service_1.DownloadsService,
        videos_service_1.VideosService])
], DownloadsController);
//# sourceMappingURL=downloads.controller.js.map