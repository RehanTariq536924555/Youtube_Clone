import { LikeType, LikeableType } from '../entities/like.entity';
export declare class CreateLikeDto {
    targetId: string;
    targetType: LikeableType;
    type: LikeType;
}
