import { Repository } from 'typeorm';
import { View } from './entities/view.entity';
import { VideosService } from '../videos/videos.service';
export declare class ViewsService {
    private viewsRepository;
    private videosService;
    constructor(viewsRepository: Repository<View>, videosService: VideosService);
    recordView(videoId: string, userId?: string, ipAddress?: string): Promise<View>;
    updateWatchTime(viewId: string, watchTime: number, completed?: boolean): Promise<View>;
    getVideoViews(videoId: string): Promise<number>;
    getUserViewHistory(userId: string): Promise<View[]>;
    deleteView(viewId: string, userId: string): Promise<void>;
    clearAllHistory(userId: string): Promise<void>;
}
