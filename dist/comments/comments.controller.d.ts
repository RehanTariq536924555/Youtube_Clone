import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    findByVideo(videoId: string): Promise<import("./entities/comment.entity").Comment[]>;
    findReplies(id: string): Promise<import("./entities/comment.entity").Comment[]>;
    findOne(id: string): Promise<import("./entities/comment.entity").Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
