import { ViewsService } from './views.service';
export declare class ViewsController {
    private readonly viewsService;
    constructor(viewsService: ViewsService);
    recordView(videoId: string, req: any, ip: string): Promise<import("./entities/view.entity").View>;
    updateWatchTime(id: string, watchTime: number, completed?: boolean): Promise<import("./entities/view.entity").View>;
    getVideoViews(videoId: string): Promise<{
        count: number;
    }>;
    getUserViewHistory(req: any): Promise<import("./entities/view.entity").View[]>;
    deleteView(id: string, req: any): Promise<{
        message: string;
    }>;
    clearAllHistory(req: any): Promise<{
        message: string;
    }>;
}
