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
exports.PlaylistsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const playlist_entity_1 = require("./entities/playlist.entity");
const playlist_video_entity_1 = require("./entities/playlist-video.entity");
let PlaylistsService = class PlaylistsService {
    constructor(playlistRepository, playlistVideoRepository) {
        this.playlistRepository = playlistRepository;
        this.playlistVideoRepository = playlistVideoRepository;
    }
    async create(userId, createPlaylistDto) {
        const playlist = this.playlistRepository.create({
            ...createPlaylistDto,
            userId,
            visibility: createPlaylistDto.visibility || playlist_entity_1.PlaylistVisibility.PUBLIC,
        });
        return await this.playlistRepository.save(playlist);
    }
    async findByUser(userId) {
        return await this.playlistRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const playlist = await this.playlistRepository.findOne({
            where: { id },
            relations: ['user', 'playlistVideos', 'playlistVideos.video', 'playlistVideos.video.user'],
        });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.visibility === playlist_entity_1.PlaylistVisibility.PRIVATE && playlist.userId !== userId) {
            throw new common_1.ForbiddenException('This playlist is private');
        }
        if (playlist.playlistVideos) {
            playlist.playlistVideos.sort((a, b) => a.position - b.position);
        }
        return playlist;
    }
    async update(id, userId, updatePlaylistDto) {
        const playlist = await this.playlistRepository.findOne({ where: { id } });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own playlists');
        }
        if (playlist.isSystemPlaylist) {
            throw new common_1.ForbiddenException('Cannot modify system playlists');
        }
        Object.assign(playlist, updatePlaylistDto);
        return await this.playlistRepository.save(playlist);
    }
    async remove(id, userId) {
        const playlist = await this.playlistRepository.findOne({ where: { id } });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own playlists');
        }
        if (playlist.isSystemPlaylist) {
            throw new common_1.ForbiddenException('Cannot delete system playlists');
        }
        await this.playlistRepository.remove(playlist);
    }
    async addVideo(playlistId, videoId, userId, position) {
        const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== userId) {
            throw new common_1.ForbiddenException('You can only add videos to your own playlists');
        }
        const existing = await this.playlistVideoRepository.findOne({
            where: { playlistId, videoId },
        });
        if (existing) {
            throw new common_1.ConflictException('Video already in playlist');
        }
        if (position === undefined) {
            const maxPosition = await this.playlistVideoRepository
                .createQueryBuilder('pv')
                .select('MAX(pv.position)', 'max')
                .where('pv.playlistId = :playlistId', { playlistId })
                .getRawOne();
            position = (maxPosition?.max || -1) + 1;
        }
        const playlistVideo = this.playlistVideoRepository.create({
            playlistId,
            videoId,
            position,
        });
        await this.playlistVideoRepository.save(playlistVideo);
        playlist.videosCount = await this.playlistVideoRepository.count({ where: { playlistId } });
        await this.playlistRepository.save(playlist);
        return playlistVideo;
    }
    async removeVideo(playlistId, videoId, userId) {
        const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        if (playlist.userId !== userId) {
            throw new common_1.ForbiddenException('You can only remove videos from your own playlists');
        }
        const playlistVideo = await this.playlistVideoRepository.findOne({
            where: { playlistId, videoId },
        });
        if (!playlistVideo) {
            throw new common_1.NotFoundException('Video not in playlist');
        }
        await this.playlistVideoRepository.remove(playlistVideo);
        playlist.videosCount = await this.playlistVideoRepository.count({ where: { playlistId } });
        await this.playlistRepository.save(playlist);
        await this.reorderVideos(playlistId);
    }
    async reorderVideos(playlistId) {
        const videos = await this.playlistVideoRepository.find({
            where: { playlistId },
            order: { position: 'ASC' },
        });
        for (let i = 0; i < videos.length; i++) {
            videos[i].position = i;
            await this.playlistVideoRepository.save(videos[i]);
        }
    }
    async getOrCreateSystemPlaylist(userId, type) {
        let playlist = await this.playlistRepository.findOne({
            where: { userId, systemPlaylistType: type, isSystemPlaylist: true },
        });
        if (!playlist) {
            const playlistData = this.getSystemPlaylistData(type);
            playlist = this.playlistRepository.create({
                userId,
                ...playlistData,
                isSystemPlaylist: true,
                systemPlaylistType: type,
                visibility: playlist_entity_1.PlaylistVisibility.PRIVATE,
            });
            playlist = await this.playlistRepository.save(playlist);
        }
        return playlist;
    }
    getSystemPlaylistData(type) {
        switch (type) {
            case playlist_entity_1.SystemPlaylistType.LIKED_VIDEOS:
                return {
                    name: 'Liked Videos',
                    description: 'Videos you have liked',
                };
            case playlist_entity_1.SystemPlaylistType.WATCH_LATER:
                return {
                    name: 'Watch Later',
                    description: 'Videos to watch later',
                };
            case playlist_entity_1.SystemPlaylistType.FAVORITES:
                return {
                    name: 'Favorites',
                    description: 'Your favorite videos',
                };
            default:
                return {
                    name: 'System Playlist',
                    description: 'System generated playlist',
                };
        }
    }
    async addToLikedVideos(userId, videoId) {
        const playlist = await this.getOrCreateSystemPlaylist(userId, playlist_entity_1.SystemPlaylistType.LIKED_VIDEOS);
        try {
            await this.addVideo(playlist.id, videoId, userId);
        }
        catch (error) {
            if (!(error instanceof common_1.ConflictException)) {
                throw error;
            }
        }
    }
    async removeFromLikedVideos(userId, videoId) {
        const playlist = await this.playlistRepository.findOne({
            where: { userId, systemPlaylistType: playlist_entity_1.SystemPlaylistType.LIKED_VIDEOS },
        });
        if (playlist) {
            try {
                await this.removeVideo(playlist.id, videoId, userId);
            }
            catch (error) {
            }
        }
    }
    async findPublicPlaylists(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [playlists, total] = await this.playlistRepository.findAndCount({
            where: { visibility: playlist_entity_1.PlaylistVisibility.PUBLIC, isSystemPlaylist: false },
            relations: ['user'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { playlists, total };
    }
};
exports.PlaylistsService = PlaylistsService;
exports.PlaylistsService = PlaylistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(playlist_entity_1.Playlist)),
    __param(1, (0, typeorm_1.InjectRepository)(playlist_video_entity_1.PlaylistVideo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlaylistsService);
//# sourceMappingURL=playlists.service.js.map