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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async create(createCommentDto, userId) {
        const comment = this.commentsRepository.create({
            ...createCommentDto,
            userId,
        });
        return this.commentsRepository.save(comment);
    }
    async findByVideo(videoId) {
        return this.commentsRepository.find({
            where: { videoId, parentId: null },
            relations: ['user', 'replies', 'replies.user'],
            select: {
                id: true,
                content: true,
                userId: true,
                videoId: true,
                parentId: true,
                likesCount: true,
                dislikesCount: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
                replies: {
                    id: true,
                    content: true,
                    userId: true,
                    videoId: true,
                    parentId: true,
                    likesCount: true,
                    dislikesCount: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    async findReplies(parentId) {
        return this.commentsRepository.find({
            where: { parentId },
            relations: ['user'],
            select: {
                id: true,
                content: true,
                userId: true,
                videoId: true,
                parentId: true,
                likesCount: true,
                dislikesCount: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: ['user', 'replies'],
            select: {
                id: true,
                content: true,
                userId: true,
                videoId: true,
                parentId: true,
                likesCount: true,
                dislikesCount: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
                replies: {
                    id: true,
                    content: true,
                    userId: true,
                    videoId: true,
                    parentId: true,
                    likesCount: true,
                    dislikesCount: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return comment;
    }
    async update(id, updateCommentDto, userId) {
        const comment = await this.findOne(id);
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own comments');
        }
        Object.assign(comment, updateCommentDto);
        return this.commentsRepository.save(comment);
    }
    async remove(id, userId) {
        const comment = await this.findOne(id);
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.commentsRepository.remove(comment);
    }
    async incrementLikes(id) {
        const comment = await this.findOne(id);
        comment.likesCount++;
        return this.commentsRepository.save(comment);
    }
    async decrementLikes(id) {
        const comment = await this.findOne(id);
        comment.likesCount = Math.max(0, comment.likesCount - 1);
        return this.commentsRepository.save(comment);
    }
    async incrementDislikes(id) {
        const comment = await this.findOne(id);
        comment.dislikesCount++;
        return this.commentsRepository.save(comment);
    }
    async decrementDislikes(id) {
        const comment = await this.findOne(id);
        comment.dislikesCount = Math.max(0, comment.dislikesCount - 1);
        return this.commentsRepository.save(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map