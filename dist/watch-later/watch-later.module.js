"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchLaterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const watch_later_controller_1 = require("./watch-later.controller");
const watch_later_service_1 = require("./watch-later.service");
const watch_later_entity_1 = require("./entities/watch-later.entity");
let WatchLaterModule = class WatchLaterModule {
};
exports.WatchLaterModule = WatchLaterModule;
exports.WatchLaterModule = WatchLaterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([watch_later_entity_1.WatchLater])],
        controllers: [watch_later_controller_1.WatchLaterController],
        providers: [watch_later_service_1.WatchLaterService],
        exports: [watch_later_service_1.WatchLaterService],
    })
], WatchLaterModule);
//# sourceMappingURL=watch-later.module.js.map