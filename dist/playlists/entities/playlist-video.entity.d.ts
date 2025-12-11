import { Playlist } from './playlist.entity';
import { Video } from '../../videos/entities/video.entity';
export declare class PlaylistVideo {
    id: string;
    playlistId: string;
    videoId: string;
    position: number;
    playlist: Playlist;
    video: Video;
    addedAt: Date;
}
