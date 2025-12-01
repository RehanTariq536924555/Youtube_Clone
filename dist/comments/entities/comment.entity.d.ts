import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
export declare class Comment {
    id: string;
    content: string;
    userId: string;
    videoId: string;
    parentId: string;
    likesCount: number;
    dislikesCount: number;
    user: User;
    video: Video;
    parent: Comment;
    replies: Comment[];
    createdAt: Date;
    updatedAt: Date;
}
