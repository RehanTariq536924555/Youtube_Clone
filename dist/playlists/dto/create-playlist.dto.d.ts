import { PlaylistVisibility } from '../entities/playlist.entity';
export declare class CreatePlaylistDto {
    name: string;
    description?: string;
    visibility?: PlaylistVisibility;
}
