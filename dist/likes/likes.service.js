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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("./entities/like.entity");
const videos_service_1 = require("../videos/videos.service");
const comments_service_1 = require("../comments/comments.service");
const playlists_service_1 = require("../playlists/playlists.service");
let LikesService = class LikesService {
    constructor(likesRepository, videosService, commentsService, playlistsService) {
        this.likesRepository = likesRepository;
        this.videosService = videosService;
        this.commentsService = commentsService;
        this.playlistsService = playlistsService;
    }
    async toggleLike(createLikeDto, userId) {
        const { targetId, targetType, type } = createLikeDto;
        const existingLike = await this.likesRepository.findOne({
            where: { userId, targetId, targetType },
        });
        if (existingLike) {
            if (existingLike.type === type) {
                await this.updateTargetCounts(targetId, targetType, existingLike.type, 'decrement');
                await this.likesRepository.remove(existingLike);
                if (targetType === like_entity_1.LikeableType.VIDEO && type === like_entity_1.LikeType.LIKE) {
                    await this.playlistsService.removeFromLikedVideos(userId, targetId);
                }
                return { action: 'removed' };
            }
            else {
                await this.updateTargetCounts(targetId, targetType, existingLike.type, 'decrement');
                existingLike.type = type;
                await this.updateTargetCounts(targetId, targetType, type, 'increment');
                const updatedLike = await this.likesRepository.save(existingLike);
                if (targetType === like_entity_1.LikeableType.VIDEO) {
                    if (type === like_entity_1.LikeType.LIKE) {
                        await this.playlistsService.addToLikedVideos(userId, targetId);
                    }
                    else {
                        await this.playlistsService.removeFromLikedVideos(userId, targetId);
                    }
                }
                return { action: 'updated', like: updatedLike };
            }
        }
        else {
            const like = this.likesRepository.create({
                userId,
                targetId,
                targetType,
                type,
            });
            await this.updateTargetCounts(targetId, targetType, type, 'increment');
            const savedLike = await this.likesRepository.save(like);
            if (targetType === like_entity_1.LikeableType.VIDEO && type === like_entity_1.LikeType.LIKE) {
                await this.playlistsService.addToLikedVideos(userId, targetId);
            }
            return { action: 'created', like: savedLike };
        }
    }
    async updateTargetCounts(targetId, targetType, likeType, action) {
        try {
            if (targetType === like_entity_1.LikeableType.VIDEO) {
                if (likeType === like_entity_1.LikeType.LIKE) {
                    if (action === 'increment') {
                        await this.videosService.incrementLikes(targetId);
                    }
                    else {
                        await this.videosService.decrementLikes(targetId);
                    }
                }
                else {
                    if (action === 'increment') {
                        await this.videosService.incrementDislikes(targetId);
                    }
                    else {
                        await this.videosService.decrementDislikes(targetId);
                    }
                }
            }
            else if (targetType === like_entity_1.LikeableType.COMMENT) {
                if (likeType === like_entity_1.LikeType.LIKE) {
                    if (action === 'increment') {
                        await this.commentsService.incrementLikes(targetId);
                    }
                    else {
                        await this.commentsService.decrementLikes(targetId);
                    }
                }
                else {
                    if (action === 'increment') {
                        await this.commentsService.incrementDislikes(targetId);
                    }
                    else {
                        await this.commentsService.decrementDislikes(targetId);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error updating target counts:', error);
        }
    }
    async getUserLike(userId, targetId, targetType) {
        return this.likesRepository.findOne({
            where: { userId, targetId, targetType },
        });
    }
    async getTargetLikes(targetId, targetType) {
        const likes = await this.likesRepository.count({
            where: { targetId, targetType, type: like_entity_1.LikeType.LIKE },
        });
        const dislikes = await this.likesRepository.count({
            where: { targetId, targetType, type: like_entity_1.LikeType.DISLIKE },
        });
        return { likes, dislikes };
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => videos_service_1.VideosService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => comments_service_1.CommentsService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => playlists_service_1.PlaylistsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        videos_service_1.VideosService,
        comments_service_1.CommentsService,
        playlists_service_1.PlaylistsService])
], LikesService);
//# sourceMappingURL=likes.service.js.map