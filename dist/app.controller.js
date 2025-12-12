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
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./users/entities/user.entity");
let AppController = AppController_1 = class AppController {
    constructor(appService, userRepository) {
        this.appService = appService;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    getHealth() {
        this.logger.log('Root GET request received');
        return this.appService.getHealth();
    }
    headHealth(res) {
        this.logger.log('Root HEAD request received');
        res.status(200).end();
    }
    getHealthCheck() {
        this.logger.log('Health check endpoint accessed');
        return this.appService.getHealthCheck();
    }
    headHealthCheck(res) {
        this.logger.log('Health check HEAD request received');
        res.status(200).end();
    }
    getApiHealth() {
        this.logger.log('API health check endpoint accessed');
        return this.appService.getApiHealth();
    }
    async promoteToAdmin(email) {
        this.logger.log('Bootstrap promote to admin endpoint accessed');
        try {
            const existingAdmin = await this.userRepository.findOne({
                where: { role: 'admin' },
            });
            if (existingAdmin) {
                return {
                    error: 'Admin user already exists. Cannot promote another user.',
                    statusCode: 400
                };
            }
            const user = await this.userRepository.findOne({
                where: { email },
            });
            if (!user) {
                return {
                    error: 'User not found',
                    statusCode: 404
                };
            }
            user.role = 'admin';
            user.isEmailVerified = true;
            await this.userRepository.save(user);
            return {
                message: 'User promoted to admin successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        }
        catch (error) {
            this.logger.error('Error promoting user to admin:', error);
            return {
                error: 'Failed to promote user to admin',
                message: error.message,
                statusCode: 500
            };
        }
    }
    getFavicon(res) {
        res.status(204).end();
    }
    headFavicon(res) {
        res.status(204).end();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Head)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "headHealth", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealthCheck", null);
__decorate([
    (0, common_1.Head)('health'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "headHealthCheck", null);
__decorate([
    (0, common_1.Get)('api/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getApiHealth", null);
__decorate([
    (0, common_1.Post)('bootstrap/promote-to-admin'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "promoteToAdmin", null);
__decorate([
    (0, common_1.Get)('favicon.ico'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getFavicon", null);
__decorate([
    (0, common_1.Head)('favicon.ico'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "headFavicon", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)(''),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [app_service_1.AppService,
        typeorm_2.Repository])
], AppController);
//# sourceMappingURL=app.controller.js.map