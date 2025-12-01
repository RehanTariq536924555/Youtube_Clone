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
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
let TestController = class TestController {
    getHello() {
        return 'Hello World!';
    }
    getHealth() {
        return { status: 'OK', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TestController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], TestController.prototype, "getHealth", null);
TestController = __decorate([
    (0, common_1.Controller)()
], TestController);
let TestModule = class TestModule {
};
TestModule = __decorate([
    (0, common_1.Module)({
        controllers: [TestController],
    })
], TestModule);
async function bootstrap() {
    try {
        console.log('🚀 Starting minimal NestJS server...');
        const app = await core_1.NestFactory.create(TestModule);
        app.enableCors();
        const port = 4000;
        await app.listen(port);
        console.log(`✅ Server running on http://localhost:${port}`);
        console.log(`✅ Health check: http://localhost:${port}/health`);
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.minimal.js.map