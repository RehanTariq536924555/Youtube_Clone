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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistVideo = void 0;
const typeorm_1 = require("typeorm");
const playlist_entity_1 = require("./playlist.entity");
const video_entity_1 = require("../../videos/entities/video.entity");
let PlaylistVideo = class PlaylistVideo {
};
exports.PlaylistVideo = PlaylistVideo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlaylistVideo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PlaylistVideo.prototype, "playlistId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PlaylistVideo.prototype, "videoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlaylistVideo.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => playlist_entity_1.Playlist, playlist => playlist.playlistVideos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'playlistId' }),
    __metadata("design:type", playlist_entity_1.Playlist)
], PlaylistVideo.prototype, "playlist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => video_entity_1.Video, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'videoId' }),
    __metadata("design:type", video_entity_1.Video)
], PlaylistVideo.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlaylistVideo.prototype, "addedAt", void 0);
exports.PlaylistVideo = PlaylistVideo = __decorate([
    (0, typeorm_1.Entity)('playlist_videos')
], PlaylistVideo);
//# sourceMappingURL=playlist-video.entity.js.map