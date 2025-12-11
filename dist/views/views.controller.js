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
exports.ViewsController = void 0;
const common_1 = require("@nestjs/common");
const views_service_1 = require("./views.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ViewsController = class ViewsController {
    constructor(viewsService) {
        this.viewsService = viewsService;
    }
    async recordView(videoId, req, ip) {
        const userId = req.user?.id;
        console.log('Recording view for video:', videoId, 'userId:', userId, 'ip:', ip);
        if (!userId) {
            console.error('No user ID found in request!');
            throw new Error('Authentication required');
        }
        const view = await this.viewsService.recordView(videoId, userId, ip);
        console.log('View recorded:', view);
        return view;
    }
    async updateWatchTime(id, watchTime, completed = false) {
        return this.viewsService.updateWatchTime(id, watchTime, completed);
    }
    async getVideoViews(videoId) {
        const count = await this.viewsService.getVideoViews(videoId);
        return { count };
    }
    async getUserViewHistory(req) {
        return this.viewsService.getUserViewHistory(req.user.id);
    }
    async deleteView(id, req) {
        await this.viewsService.deleteView(id, req.user.id);
        return { message: 'View deleted successfully' };
    }
    async clearAllHistory(req) {
        await this.viewsService.clearAllHistory(req.user.id);
        return { message: 'History cleared successfully' };
    }
};
exports.ViewsController = ViewsController;
__decorate([
    (0, common_1.Post)('record/:videoId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "recordView", null);
__decorate([
    (0, common_1.Patch)(':id/watch-time'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('watchTime')),
    __param(2, (0, common_1.Body)('completed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "updateWatchTime", null);
__decorate([
    (0, common_1.Get)('video/:videoId/count'),
    __param(0, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "getVideoViews", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "getUserViewHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "deleteView", null);
__decorate([
    (0, common_1.Delete)('history/clear'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewsController.prototype, "clearAllHistory", null);
exports.ViewsController = ViewsController = __decorate([
    (0, common_1.Controller)('views'),
    __metadata("design:paramtypes", [views_service_1.ViewsService])
], ViewsController);
//# sourceMappingURL=views.controller.js.map