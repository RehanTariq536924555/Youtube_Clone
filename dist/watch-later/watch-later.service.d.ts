import { Repository } from 'typeorm';
import { WatchLater } from './entities/watch-later.entity';
export declare class WatchLaterService {
    private watchLaterRepository;
    constructor(watchLaterRepository: Repository<WatchLater>);
    addToWatchLater(userId: string, videoId: string): Promise<WatchLater>;
    removeFromWatchLater(userId: string, videoId: string): Promise<void>;
    toggleWatchLater(userId: string, videoId: string): Promise<{
        added: boolean;
        message: string;
    }>;
    getWatchLaterVideos(userId: string): Promise<{
        addedAt: Date;
        id: string;
        title: string;
        description: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        thumbnail: string;
        visibility: import("../videos/entities/video.entity").VideoVisibility;
        userId: string;
        viewsCount: number;
        likesCount: number;
        dislikesCount: number;
        commentsCount: number;
        tags: string[];
        category: string;
        duration: number;
        isShort: boolean;
        user: import("../users/entities/user.entity").User;
        comments: import("../comments/entities/comment.entity").Comment[];
        views: import("../views/entities/view.entity").View[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    isInWatchLater(userId: string, videoId: string): Promise<boolean>;
    getWatchLaterCount(userId: string): Promise<number>;
}
