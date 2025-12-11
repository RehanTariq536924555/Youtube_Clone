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
exports.ViewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const view_entity_1 = require("./entities/view.entity");
const videos_service_1 = require("../videos/videos.service");
let ViewsService = class ViewsService {
    constructor(viewsRepository, videosService) {
        this.viewsRepository = viewsRepository;
        this.videosService = videosService;
    }
    async recordView(videoId, userId, ipAddress) {
        console.log('Recording view - videoId:', videoId, 'userId:', userId, 'ipAddress:', ipAddress);
        let existingView = null;
        if (userId) {
            existingView = await this.viewsRepository.findOne({
                where: { videoId, userId },
            });
            console.log('Existing view for user:', existingView ? 'Found' : 'Not found');
        }
        else if (ipAddress) {
            existingView = await this.viewsRepository.findOne({
                where: { videoId, ipAddress },
            });
            console.log('Existing view for IP:', existingView ? 'Found' : 'Not found');
        }
        if (existingView) {
            console.log('Updating existing view:', existingView.id);
            existingView.watchTime = 0;
            existingView.completed = false;
            await this.viewsRepository.remove(existingView);
            const newView = this.viewsRepository.create({
                videoId,
                userId,
                ipAddress,
            });
            return this.viewsRepository.save(newView);
        }
        else {
            console.log('Creating new view');
            const view = this.viewsRepository.create({
                videoId,
                userId,
                ipAddress,
            });
            await this.videosService.incrementViews(videoId);
            const savedView = await this.viewsRepository.save(view);
            console.log('View saved:', savedView.id);
            return savedView;
        }
    }
    async updateWatchTime(viewId, watchTime, completed = false) {
        const view = await this.viewsRepository.findOne({ where: { id: viewId } });
        if (view) {
            view.watchTime = watchTime;
            view.completed = completed;
            return this.viewsRepository.save(view);
        }
        throw new Error('View not found');
    }
    async getVideoViews(videoId) {
        return this.viewsRepository.count({ where: { videoId } });
    }
    async getUserViewHistory(userId) {
        console.log('Getting view history for user:', userId);
        const views = await this.viewsRepository.find({
            where: { userId },
            relations: ['video', 'video.user'],
            order: { createdAt: 'DESC' },
        });
        console.log('Found', views.length, 'views for user');
        return views;
    }
    async deleteView(viewId, userId) {
        const view = await this.viewsRepository.findOne({
            where: { id: viewId, userId },
        });
        if (!view) {
            throw new Error('View not found or unauthorized');
        }
        await this.viewsRepository.remove(view);
    }
    async clearAllHistory(userId) {
        await this.viewsRepository.delete({ userId });
    }
};
exports.ViewsService = ViewsService;
exports.ViewsService = ViewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(view_entity_1.View)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => videos_service_1.VideosService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        videos_service_1.VideosService])
], ViewsService);
//# sourceMappingURL=views.service.js.map