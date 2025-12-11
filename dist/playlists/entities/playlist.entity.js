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
exports.Playlist = exports.SystemPlaylistType = exports.PlaylistVisibility = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const playlist_video_entity_1 = require("./playlist-video.entity");
var PlaylistVisibility;
(function (PlaylistVisibility) {
    PlaylistVisibility["PUBLIC"] = "public";
    PlaylistVisibility["UNLISTED"] = "unlisted";
    PlaylistVisibility["PRIVATE"] = "private";
})(PlaylistVisibility || (exports.PlaylistVisibility = PlaylistVisibility = {}));
var SystemPlaylistType;
(function (SystemPlaylistType) {
    SystemPlaylistType["LIKED_VIDEOS"] = "liked_videos";
    SystemPlaylistType["WATCH_LATER"] = "watch_later";
    SystemPlaylistType["FAVORITES"] = "favorites";
})(SystemPlaylistType || (exports.SystemPlaylistType = SystemPlaylistType = {}));
let Playlist = class Playlist {
};
exports.Playlist = Playlist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Playlist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Playlist.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Playlist.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlaylistVisibility,
        default: PlaylistVisibility.PUBLIC,
    }),
    __metadata("design:type", String)
], Playlist.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Playlist.prototype, "isSystemPlaylist", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SystemPlaylistType,
        nullable: true,
    }),
    __metadata("design:type", String)
], Playlist.prototype, "systemPlaylistType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Playlist.prototype, "videosCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Playlist.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => playlist_video_entity_1.PlaylistVideo, playlistVideo => playlistVideo.playlist),
    __metadata("design:type", Array)
], Playlist.prototype, "playlistVideos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Playlist.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Playlist.prototype, "updatedAt", void 0);
exports.Playlist = Playlist = __decorate([
    (0, typeorm_1.Entity)('playlists')
], Playlist);
//# sourceMappingURL=playlist.entity.js.map