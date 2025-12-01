import { User } from '../../users/entities/user.entity';
export declare class Subscription {
    id: string;
    subscriberId: string;
    channelId: string;
    notificationsEnabled: boolean;
    subscriber: User;
    channel: User;
    createdAt: Date;
}
