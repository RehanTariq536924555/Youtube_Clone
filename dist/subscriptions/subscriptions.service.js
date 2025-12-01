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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./entities/subscription.entity");
const user_entity_1 = require("../users/entities/user.entity");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionsRepository, usersRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.usersRepository = usersRepository;
    }
    async toggleSubscription(subscriberId, channelId) {
        if (subscriberId === channelId) {
            throw new common_1.BadRequestException('You cannot subscribe to yourself');
        }
        const existingSubscription = await this.subscriptionsRepository.findOne({
            where: { subscriberId, channelId },
        });
        if (existingSubscription) {
            await this.subscriptionsRepository.remove(existingSubscription);
            await this.updateSubscriberCount(channelId, 'decrement');
            return { action: 'unsubscribed' };
        }
        else {
            const subscription = this.subscriptionsRepository.create({
                subscriberId,
                channelId,
            });
            const savedSubscription = await this.subscriptionsRepository.save(subscription);
            await this.updateSubscriberCount(channelId, 'increment');
            return { action: 'subscribed', subscription: savedSubscription };
        }
    }
    async isSubscribed(subscriberId, channelId) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { subscriberId, channelId },
        });
        return !!subscription;
    }
    async getSubscriptions(subscriberId) {
        return this.subscriptionsRepository.find({
            where: { subscriberId },
            relations: ['channel'],
            order: { createdAt: 'DESC' },
        });
    }
    async getSubscribers(channelId) {
        return this.subscriptionsRepository.find({
            where: { channelId },
            relations: ['subscriber'],
            order: { createdAt: 'DESC' },
        });
    }
    async getSubscriberCount(channelId) {
        return this.subscriptionsRepository.count({
            where: { channelId },
        });
    }
    async updateSubscriberCount(channelId, action) {
        const user = await this.usersRepository.findOne({ where: { id: channelId } });
        if (user) {
            if (action === 'increment') {
                user.subscribersCount++;
            }
            else {
                user.subscribersCount = Math.max(0, user.subscribersCount - 1);
            }
            await this.usersRepository.save(user);
        }
    }
    async updateNotificationSettings(subscriberId, channelId, notificationsEnabled) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: { subscriberId, channelId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.notificationsEnabled = notificationsEnabled;
        return this.subscriptionsRepository.save(subscription);
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map