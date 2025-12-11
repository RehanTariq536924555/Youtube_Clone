import { ChannelsService } from '../channels/channels.service';
export declare class AdminChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getAllChannels(page?: string, limit?: string, search?: string): Promise<{
        channels: import("../channels/entities/channel.entity").Channel[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getChannelStats(): Promise<{
        totalChannels: number;
        activeChannels: number;
        suspendedChannels: number;
    }>;
    getUserChannels(userId: string): Promise<import("../channels/entities/channel.entity").Channel[]>;
    getUserChannelCount(userId: string): Promise<number>;
    getChannelDetails(id: string): Promise<import("../channels/entities/channel.entity").Channel>;
    suspendChannel(id: string, reason: string): Promise<import("../channels/entities/channel.entity").Channel>;
    unsuspendChannel(id: string): Promise<import("../channels/entities/channel.entity").Channel>;
    deleteChannel(id: string): Promise<void>;
}
