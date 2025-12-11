import { User } from '../../users/entities/user.entity';
import { PlaylistVideo } from './playlist-video.entity';
export declare enum PlaylistVisibility {
    PUBLIC = "public",
    UNLISTED = "unlisted",
    PRIVATE = "private"
}
export declare enum SystemPlaylistType {
    LIKED_VIDEOS = "liked_videos",
    WATCH_LATER = "watch_later",
    FAVORITES = "favorites"
}
export declare class Playlist {
    id: string;
    userId: string;
    name: string;
    description: string;
    visibility: PlaylistVisibility;
    isSystemPlaylist: boolean;
    systemPlaylistType: SystemPlaylistType;
    thumbnail: string;
    videosCount: number;
    user: User;
    playlistVideos: PlaylistVideo[];
    createdAt: Date;
    updatedAt: Date;
}
