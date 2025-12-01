import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    toggleSubscription(channelId: string, req: any): Promise<{
        action: string;
        subscription?: import("./entities/subscription.entity").Subscription;
    }>;
    isSubscribed(channelId: string, req: any): Promise<{
        isSubscribed: boolean;
    }>;
    getMySubscriptions(req: any): Promise<import("./entities/subscription.entity").Subscription[]>;
    getSubscribers(channelId: string): Promise<import("./entities/subscription.entity").Subscription[]>;
    getSubscriberCount(channelId: string): Promise<{
        count: number;
    }>;
    updateNotifications(channelId: string, notificationsEnabled: boolean, req: any): Promise<import("./entities/subscription.entity").Subscription>;
}
