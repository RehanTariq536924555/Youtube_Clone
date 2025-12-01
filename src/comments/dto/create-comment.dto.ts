import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUUID()
  videoId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}