import { User } from '../../users/entities/user.entity';
export declare enum LikeType {
    LIKE = "like",
    DISLIKE = "dislike"
}
export declare enum LikeableType {
    VIDEO = "video",
    COMMENT = "comment"
}
export declare class Like {
    id: string;
    userId: string;
    targetId: string;
    targetType: LikeableType;
    type: LikeType;
    user: User;
    createdAt: Date;
}
