import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { View } from '../../views/entities/view.entity';
export declare enum VideoVisibility {
    PUBLIC = "public",
    UNLISTED = "unlisted",
    PRIVATE = "private"
}
export declare class Video {
    id: string;
    title: string;
    description: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    thumbnail: string;
    visibility: VideoVisibility;
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
    user: User;
    channel: any;
    comments: Comment[];
    views: View[];
    createdAt: Date;
    updatedAt: Date;
}
