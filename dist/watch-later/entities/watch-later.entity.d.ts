import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
export declare class WatchLater {
    id: string;
    userId: string;
    videoId: string;
    addedAt: Date;
    user: User;
    video: Video;
}
