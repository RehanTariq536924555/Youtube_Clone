import { User } from '../../users/entities/user.entity';
export declare class Channel {
    id: string;
    name: string;
    handle: string;
    description: string;
    avatar: string;
    banner: string;
    userId: string;
    subscribersCount: number;
    videosCount: number;
    totalViews: number;
    isSuspended: boolean;
    suspensionReason: string;
    isActive: boolean;
    user: User;
    videos: any[];
    createdAt: Date;
    updatedAt: Date;
}
