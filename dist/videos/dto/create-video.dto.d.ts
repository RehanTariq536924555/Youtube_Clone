import { VideoVisibility } from '../entities/video.entity';
export declare class CreateVideoDto {
    title: string;
    description?: string;
    visibility?: VideoVisibility;
    thumbnail?: string;
    tags?: string[];
    category?: string;
    duration?: number;
    isShort?: boolean;
}
