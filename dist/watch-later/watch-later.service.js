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
exports.WatchLaterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const watch_later_entity_1 = require("./entities/watch-later.entity");
let WatchLaterService = class WatchLaterService {
    constructor(watchLaterRepository) {
        this.watchLaterRepository = watchLaterRepository;
    }
    async addToWatchLater(userId, videoId) {
        const existing = await this.watchLaterRepository.findOne({
            where: { userId, videoId },
        });
        if (existing) {
            throw new common_1.ConflictException('Video already in Watch Later');
        }
        const watchLater = this.watchLaterRepository.create({
            userId,
            videoId,
        });
        return this.watchLaterRepository.save(watchLater);
    }
    async removeFromWatchLater(userId, videoId) {
        const watchLater = await this.watchLaterRepository.findOne({
            where: { userId, videoId },
        });
        if (!watchLater) {
            throw new common_1.NotFoundException('Video not found in Watch Later');
        }
        await this.watchLaterRepository.remove(watchLater);
    }
    async toggleWatchLater(userId, videoId) {
        const existing = await this.watchLaterRepository.findOne({
            where: { userId, videoId },
        });
        if (existing) {
            await this.watchLaterRepository.remove(existing);
            return { added: false, message: 'Removed from Watch Later' };
        }
        else {
            await this.addToWatchLater(userId, videoId);
            return { added: true, message: 'Added to Watch Later' };
        }
    }
    async getWatchLaterVideos(userId) {
        const watchLaterItems = await this.watchLaterRepository.find({
            where: { userId },
            relations: ['video', 'video.user'],
            order: { addedAt: 'DESC' },
        });
        return watchLaterItems.map(item => ({
            ...item.video,
            addedAt: item.addedAt,
        }));
    }
    async isInWatchLater(userId, videoId) {
        const count = await this.watchLaterRepository.count({
            where: { userId, videoId },
        });
        return count > 0;
    }
    async getWatchLaterCount(userId) {
        return this.watchLaterRepository.count({
            where: { userId },
        });
    }
};
exports.WatchLaterService = WatchLaterService;
exports.WatchLaterService = WatchLaterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(watch_later_entity_1.WatchLater)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WatchLaterService);
//# sourceMappingURL=watch-later.service.js.map