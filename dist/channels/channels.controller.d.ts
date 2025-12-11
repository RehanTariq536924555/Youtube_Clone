import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    create(req: any, createChannelDto: CreateChannelDto): Promise<import("./entities/channel.entity").Channel>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        channels: import("./entities/channel.entity").Channel[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findMyChannels(req: any): Promise<import("./entities/channel.entity").Channel[]>;
    getMyChannelCount(req: any): Promise<number>;
    findOne(id: string): Promise<import("./entities/channel.entity").Channel>;
    findByHandle(handle: string): Promise<import("./entities/channel.entity").Channel>;
    update(id: string, req: any, updateChannelDto: UpdateChannelDto): Promise<import("./entities/channel.entity").Channel>;
    remove(id: string, req: any): Promise<void>;
}
