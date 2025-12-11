import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PlaylistVisibility } from '../entities/playlist.entity';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PlaylistVisibility)
  visibility?: PlaylistVisibility;
}
