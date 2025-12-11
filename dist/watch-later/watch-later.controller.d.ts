import { WatchLaterService } from './watch-later.service';
export declare class WatchLaterController {
    private readonly watchLaterService;
    constructor(watchLaterService: WatchLaterService);
    toggleWatchLater(req: any, videoId: string): Promise<{
        added: boolean;
        message: string;
    }>;
    addToWatchLater(req: any, videoId: string): Promise<import("./entities/watch-later.entity").WatchLater>;
    removeFromWatchLater(req: any, videoId: string): Promise<{
        message: string;
    }>;
    getWatchLaterVideos(req: any): Promise<{
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
        channelId: string;
        viewsCount: number;
        likesCount: number;
        dislikesCount: number;
        commentsCount: number;
        tags: string[];
        category: string;
        duration: number;
        isShort: boolean;
        isFeatured: boolean;
        isSuspended: boolean;
        suspensionReason: string;
        user: import("../users/entities/user.entity").User;
        channel: any;
        comments: import("../comments/entities/comment.entity").Comment[];
        views: import("../views/entities/view.entity").View[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    checkWatchLater(req: any, videoId: string): Promise<{
        isInWatchLater: boolean;
    }>;
    getWatchLaterCount(req: any): Promise<{
        count: number;
    }>;
}
