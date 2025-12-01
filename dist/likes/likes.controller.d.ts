import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeableType } from './entities/like.entity';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggleLike(createLikeDto: CreateLikeDto, req: any): Promise<{
        action: string;
        like?: import("./entities/like.entity").Like;
    }>;
    getUserLike(targetId: string, targetType: LikeableType, req: any): Promise<import("./entities/like.entity").Like>;
    getTargetLikes(targetId: string, targetType: LikeableType): Promise<{
        likes: number;
        dislikes: number;
    }>;
}
