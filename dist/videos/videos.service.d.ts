import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
export declare class VideosService {
    private videosRepository;
    constructor(videosRepository: Repository<Video>);
    create(createVideoDto: CreateVideoDto, file: Express.Multer.File, userId: string, thumbnailFile?: Express.Multer.File): Promise<Video>;
    findAll(userId?: string): Promise<Video[]>;
    findOne(id: string, userId?: string): Promise<Video>;
    update(id: string, updateVideoDto: UpdateVideoDto, userId: string): Promise<Video>;
    remove(id: string, userId: string): Promise<void>;
    findUserVideos(userId: string): Promise<Video[]>;
    incrementViews(id: string): Promise<Video>;
    incrementLikes(id: string): Promise<Video>;
    decrementLikes(id: string): Promise<Video>;
    incrementDislikes(id: string): Promise<Video>;
    decrementDislikes(id: string): Promise<Video>;
    incrementComments(id: string): Promise<Video>;
    decrementComments(id: string): Promise<Video>;
    searchVideos(query: string): Promise<Video[]>;
    findByCategory(category: string): Promise<Video[]>;
    findTrending(): Promise<Video[]>;
    findAllShorts(userId?: string): Promise<Video[]>;
    findTrendingShorts(): Promise<Video[]>;
    markAsShort(id: string, userId: string): Promise<Video>;
    autoDetectShorts(): Promise<void>;
}
