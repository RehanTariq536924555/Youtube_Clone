import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { LikeType, LikeableType } from '../entities/like.entity';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @IsNotEmpty()
  @IsEnum(LikeableType)
  targetType: LikeableType;

  @IsNotEmpty()
  @IsEnum(LikeType)
  type: LikeType;
}