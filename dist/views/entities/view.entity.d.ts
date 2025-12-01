import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
export declare class View {
    id: string;
    userId: string;
    videoId: string;
    ipAddress: string;
    watchTime: number;
    completed: boolean;
    user: User;
    video: Video;
    createdAt: Date;
}
