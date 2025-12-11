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
exports.AdminChannelsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("./guards/admin.guard");
const channels_service_1 = require("../channels/channels.service");
let AdminChannelsController = class AdminChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    getAllChannels(page = '1', limit = '20', search) {
        return this.channelsService.getAllChannelsForAdmin(+page, +limit, search);
    }
    getChannelStats() {
        return this.channelsService.getChannelStats();
    }
    getUserChannels(userId) {
        return this.channelsService.findByUser(userId);
    }
    getUserChannelCount(userId) {
        return this.channelsService.getUserChannelCount(userId);
    }
    getChannelDetails(id) {
        return this.channelsService.findOne(id);
    }
    suspendChannel(id, reason) {
        return this.channelsService.suspendChannel(id, reason);
    }
    unsuspendChannel(id) {
        return this.channelsService.unsuspendChannel(id);
    }
    deleteChannel(id) {
        return this.channelsService.deleteChannelPermanently(id);
    }
};
exports.AdminChannelsController = AdminChannelsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "getAllChannels", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "getChannelStats", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "getUserChannels", null);
__decorate([
    (0, common_1.Get)('user/:userId/count'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "getUserChannelCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "getChannelDetails", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "suspendChannel", null);
__decorate([
    (0, common_1.Post)(':id/unsuspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "unsuspendChannel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminChannelsController.prototype, "deleteChannel", null);
exports.AdminChannelsController = AdminChannelsController = __decorate([
    (0, common_1.Controller)('admin/channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], AdminChannelsController);
//# sourceMappingURL=admin-channels.controller.js.map