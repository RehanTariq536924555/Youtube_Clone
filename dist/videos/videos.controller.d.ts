import { StreamableFile } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Response } from 'express';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    uploadVideo(files: {
        video?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    }, createVideoDto: CreateVideoDto, req: any): Promise<{
        message: string;
        video: {
            id: string;
            title: string;
            description: string;
            visibility: import("./entities/video.entity").VideoVisibility;
            filename: string;
            originalName: string;
            size: number;
            thumbnail: string;
            createdAt: Date;
        };
    }>;
    testAuth(req: any): Promise<{
        message: string;
        user: any;
        timestamp: string;
    }>;
    findAll(req: any): Promise<import("./entities/video.entity").Video[]>;
    searchVideos(query: string): Promise<import("./entities/video.entity").Video[]>;
    getTrending(): Promise<import("./entities/video.entity").Video[]>;
    getByCategory(category: string): Promise<import("./entities/video.entity").Video[]>;
    getAllShorts(req: any): Promise<import("./entities/video.entity").Video[]>;
    getTrendingShorts(): Promise<import("./entities/video.entity").Video[]>;
    markAsShort(id: string, req: any): Promise<import("./entities/video.entity").Video>;
    debugShorts(): Promise<{
        totalVideos: number;
        totalShorts: number;
        allVideos: {
            id: string;
            title: string;
            isShort: boolean;
            duration: number;
            visibility: import("./entities/video.entity").VideoVisibility;
        }[];
        shorts: {
            id: string;
            title: string;
            isShort: boolean;
            duration: number;
            visibility: import("./entities/video.entity").VideoVisibility;
        }[];
        error?: undefined;
        message?: undefined;
    } | {
        error: any;
        message: string;
        totalVideos?: undefined;
        totalShorts?: undefined;
        allVideos?: undefined;
        shorts?: undefined;
    }>;
    markAllAsShorts(): Promise<{
        message: string;
        totalShorts: number;
        updatedVideos: number;
        error?: undefined;
    } | {
        error: any;
        message: string;
        totalShorts?: undefined;
        updatedVideos?: undefined;
    }>;
    findMyVideos(req: any): Promise<import("./entities/video.entity").Video[]>;
    findOne(id: string, req: any): Promise<import("./entities/video.entity").Video>;
    streamVideo(id: string, req: any, res: Response): Promise<StreamableFile>;
    getThumbnail(id: string, req: any, res: Response): Promise<StreamableFile>;
    update(id: string, updateVideoDto: UpdateVideoDto, req: any): Promise<import("./entities/video.entity").Video>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
