import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoToPlaylistDto } from './dto/add-video-to-playlist.dto';
export declare class PlaylistsController {
    private readonly playlistsService;
    constructor(playlistsService: PlaylistsService);
    create(req: any, createPlaylistDto: CreatePlaylistDto): Promise<import("./entities/playlist.entity").Playlist>;
    getMyPlaylists(req: any): Promise<import("./entities/playlist.entity").Playlist[]>;
    getPublicPlaylists(page?: string, limit?: string): Promise<{
        playlists: import("./entities/playlist.entity").Playlist[];
        total: number;
    }>;
    getPlaylist(id: string, req: any): Promise<import("./entities/playlist.entity").Playlist>;
    update(id: string, req: any, updatePlaylistDto: UpdatePlaylistDto): Promise<import("./entities/playlist.entity").Playlist>;
    remove(id: string, req: any): Promise<void>;
    addVideo(id: string, req: any, addVideoDto: AddVideoToPlaylistDto): Promise<import("./entities/playlist-video.entity").PlaylistVideo>;
    removeVideo(id: string, videoId: string, req: any): Promise<void>;
}
