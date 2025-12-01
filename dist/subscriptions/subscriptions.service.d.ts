import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';
export declare class SubscriptionsService {
    private subscriptionsRepository;
    private usersRepository;
    constructor(subscriptionsRepository: Repository<Subscription>, usersRepository: Repository<User>);
    toggleSubscription(subscriberId: string, channelId: string): Promise<{
        action: string;
        subscription?: Subscription;
    }>;
    isSubscribed(subscriberId: string, channelId: string): Promise<boolean>;
    getSubscriptions(subscriberId: string): Promise<Subscription[]>;
    getSubscribers(channelId: string): Promise<Subscription[]>;
    getSubscriberCount(channelId: string): Promise<number>;
    private updateSubscriberCount;
    updateNotificationSettings(subscriberId: string, channelId: string, notificationsEnabled: boolean): Promise<Subscription>;
}
