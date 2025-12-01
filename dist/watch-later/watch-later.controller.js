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
exports.WatchLaterController = void 0;
const common_1 = require("@nestjs/common");
const watch_later_service_1 = require("./watch-later.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WatchLaterController = class WatchLaterController {
    constructor(watchLaterService) {
        this.watchLaterService = watchLaterService;
    }
    async toggleWatchLater(req, videoId) {
        const userId = req.user.id;
        return this.watchLaterService.toggleWatchLater(userId, videoId);
    }
    async addToWatchLater(req, videoId) {
        const userId = req.user.id;
        return this.watchLaterService.addToWatchLater(userId, videoId);
    }
    async removeFromWatchLater(req, videoId) {
        const userId = req.user.id;
        await this.watchLaterService.removeFromWatchLater(userId, videoId);
        return { message: 'Removed from Watch Later' };
    }
    async getWatchLaterVideos(req) {
        const userId = req.user.id;
        return this.watchLaterService.getWatchLaterVideos(userId);
    }
    async checkWatchLater(req, videoId) {
        const userId = req.user.id;
        const isInWatchLater = await this.watchLaterService.isInWatchLater(userId, videoId);
        return { isInWatchLater };
    }
    async getWatchLaterCount(req) {
        const userId = req.user.id;
        const count = await this.watchLaterService.getWatchLaterCount(userId);
        return { count };
    }
};
exports.WatchLaterController = WatchLaterController;
__decorate([
    (0, common_1.Post)('toggle/:videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "toggleWatchLater", null);
__decorate([
    (0, common_1.Post)(':videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "addToWatchLater", null);
__decorate([
    (0, common_1.Delete)(':videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "removeFromWatchLater", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "getWatchLaterVideos", null);
__decorate([
    (0, common_1.Get)('check/:videoId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "checkWatchLater", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WatchLaterController.prototype, "getWatchLaterCount", null);
exports.WatchLaterController = WatchLaterController = __decorate([
    (0, common_1.Controller)('watch-later'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [watch_later_service_1.WatchLaterService])
], WatchLaterController);
//# sourceMappingURL=watch-later.controller.js.map