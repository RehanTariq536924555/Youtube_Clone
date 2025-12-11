import { Repository } from 'typeorm';
import { Like, LikeableType } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { VideosService } from '../videos/videos.service';
import { CommentsService } from '../comments/comments.service';
import { PlaylistsService } from '../playlists/playlists.service';
export declare class LikesService {
    private likesRepository;
    private videosService;
    private commentsService;
    private playlistsService;
    constructor(likesRepository: Repository<Like>, videosService: VideosService, commentsService: CommentsService, playlistsService: PlaylistsService);
    toggleLike(createLikeDto: CreateLikeDto, userId: string): Promise<{
        action: string;
        like?: Like;
    }>;
    private updateTargetCounts;
    getUserLike(userId: string, targetId: string, targetType: LikeableType): Promise<Like | null>;
    getTargetLikes(targetId: string, targetType: LikeableType): Promise<{
        likes: number;
        dislikes: number;
    }>;
}
