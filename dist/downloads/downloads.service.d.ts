import { Repository } from 'typeorm';
import { Download } from './entities/download.entity';
export declare class DownloadsService {
    private downloadsRepository;
    constructor(downloadsRepository: Repository<Download>);
    recordDownload(userId: string, videoId: string): Promise<Download>;
    getDownloads(userId: string): Promise<{
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
    removeDownload(userId: string, videoId: string): Promise<void>;
    getDownloadCount(userId: string): Promise<number>;
}
