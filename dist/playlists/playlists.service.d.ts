import { Repository } from 'typeorm';
import { Playlist, SystemPlaylistType } from './entities/playlist.entity';
import { PlaylistVideo } from './entities/playlist-video.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
export declare class PlaylistsService {
    private playlistRepository;
    private playlistVideoRepository;
    constructor(playlistRepository: Repository<Playlist>, playlistVideoRepository: Repository<PlaylistVideo>);
    create(userId: string, createPlaylistDto: CreatePlaylistDto): Promise<Playlist>;
    findByUser(userId: string): Promise<Playlist[]>;
    findOne(id: string, userId?: string): Promise<Playlist>;
    update(id: string, userId: string, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist>;
    remove(id: string, userId: string): Promise<void>;
    addVideo(playlistId: string, videoId: string, userId: string, position?: number): Promise<PlaylistVideo>;
    removeVideo(playlistId: string, videoId: string, userId: string): Promise<void>;
    private reorderVideos;
    getOrCreateSystemPlaylist(userId: string, type: SystemPlaylistType): Promise<Playlist>;
    private getSystemPlaylistData;
    addToLikedVideos(userId: string, videoId: string): Promise<void>;
    removeFromLikedVideos(userId: string, videoId: string): Promise<void>;
    findPublicPlaylists(page?: number, limit?: number): Promise<{
        playlists: Playlist[];
        total: number;
    }>;
}
