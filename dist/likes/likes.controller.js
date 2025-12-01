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
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const likes_service_1 = require("./likes.service");
const create_like_dto_1 = require("./dto/create-like.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const like_entity_1 = require("./entities/like.entity");
let LikesController = class LikesController {
    constructor(likesService) {
        this.likesService = likesService;
    }
    async toggleLike(createLikeDto, req) {
        return this.likesService.toggleLike(createLikeDto, req.user.id);
    }
    async getUserLike(targetId, targetType, req) {
        return this.likesService.getUserLike(req.user.id, targetId, targetType);
    }
    async getTargetLikes(targetId, targetType) {
        return this.likesService.getTargetLikes(targetId, targetType);
    }
};
exports.LikesController = LikesController;
__decorate([
    (0, common_1.Post)('toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_like_dto_1.CreateLikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Get)('user/:targetId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('targetId')),
    __param(1, (0, common_1.Query)('targetType')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getUserLike", null);
__decorate([
    (0, common_1.Get)('stats/:targetId'),
    __param(0, (0, common_1.Param)('targetId')),
    __param(1, (0, common_1.Query)('targetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LikesController.prototype, "getTargetLikes", null);
exports.LikesController = LikesController = __decorate([
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
//# sourceMappingURL=likes.controller.js.map