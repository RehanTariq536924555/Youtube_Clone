import { IsUUID, IsOptional, IsInt } from 'class-validator';

export class AddVideoToPlaylistDto {
  @IsUUID()
  videoId: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
