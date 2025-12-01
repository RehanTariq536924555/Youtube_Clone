import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
export declare class Download {
    id: string;
    userId: string;
    videoId: string;
    downloadedAt: Date;
    user: User;
    video: Video;
}
