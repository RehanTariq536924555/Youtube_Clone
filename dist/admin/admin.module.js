"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_channels_controller_1 = require("./admin-channels.controller");
const admin_service_1 = require("./admin.service");
const admin_guard_1 = require("./guards/admin.guard");
const user_entity_1 = require("../users/entities/user.entity");
const video_entity_1 = require("../videos/entities/video.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const view_entity_1 = require("../views/entities/view.entity");
const channel_entity_1 = require("../channels/entities/channel.entity");
const channels_module_1 = require("../channels/channels.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, video_entity_1.Video, comment_entity_1.Comment, view_entity_1.View, channel_entity_1.Channel]),
            channels_module_1.ChannelsModule,
        ],
        controllers: [admin_controller_1.AdminController, admin_channels_controller_1.AdminChannelsController],
        providers: [admin_service_1.AdminService, admin_guard_1.AdminGuard],
        exports: [admin_service_1.AdminService, admin_guard_1.AdminGuard],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map