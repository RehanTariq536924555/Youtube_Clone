import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { DownloadsService } from './downloads.service';
import { VideosService } from '../videos/videos.service';
export declare class DownloadsController {
    private readonly downloadsService;
    private readonly videosService;
    constructor(downloadsService: DownloadsService, videosService: VideosService);
    recordDownload(req: any, videoId: string): Promise<{
        message: string;
    }>;
    getDownloads(req: any): Promise<{
        downloadedAt: Date;
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
    removeDownload(req: any, videoId: string): Promise<{
        message: string;
    }>;
    getDownloadCount(req: any): Promise<{
        count: number;
    }>;
    downloadVideo(req: any, videoId: string, res: Response): Promise<StreamableFile>;
}
