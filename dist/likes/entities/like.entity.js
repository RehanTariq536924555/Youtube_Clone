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
exports.Like = exports.LikeableType = exports.LikeType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var LikeType;
(function (LikeType) {
    LikeType["LIKE"] = "like";
    LikeType["DISLIKE"] = "dislike";
})(LikeType || (exports.LikeType = LikeType = {}));
var LikeableType;
(function (LikeableType) {
    LikeableType["VIDEO"] = "video";
    LikeableType["COMMENT"] = "comment";
})(LikeableType || (exports.LikeableType = LikeableType = {}));
let Like = class Like {
};
exports.Like = Like;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Like.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Like.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Like.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LikeableType
    }),
    __metadata("design:type", String)
], Like.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LikeType
    }),
    __metadata("design:type", String)
], Like.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.likes),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Like.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Like.prototype, "createdAt", void 0);
exports.Like = Like = __decorate([
    (0, typeorm_1.Entity)('likes'),
    (0, typeorm_1.Unique)(['userId', 'targetId', 'targetType'])
], Like);
//# sourceMappingURL=like.entity.js.map