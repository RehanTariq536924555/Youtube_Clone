import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private commentsRepository;
    constructor(commentsRepository: Repository<Comment>);
    create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment>;
    findByVideo(videoId: string): Promise<Comment[]>;
    findReplies(parentId: string): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment>;
    remove(id: string, userId: string): Promise<void>;
    incrementLikes(id: string): Promise<Comment>;
    decrementLikes(id: string): Promise<Comment>;
    incrementDislikes(id: string): Promise<Comment>;
    decrementDislikes(id: string): Promise<Comment>;
}
