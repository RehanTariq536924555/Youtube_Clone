import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PlaylistVisibility } from '../entities/playlist.entity';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PlaylistVisibility)
  visibility?: PlaylistVisibility;
}
