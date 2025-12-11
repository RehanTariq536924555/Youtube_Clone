import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
export declare class ChannelsService {
    private channelRepository;
    constructor(channelRepository: Repository<Channel>);
    create(userId: string, createChannelDto: CreateChannelDto): Promise<Channel>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        channels: Channel[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByUser(userId: string): Promise<Channel[]>;
    findOne(id: string): Promise<Channel>;
    findByHandle(handle: string): Promise<Channel>;
    update(id: string, userId: string, updateChannelDto: UpdateChannelDto): Promise<Channel>;
    remove(id: string, userId: string): Promise<void>;
    getUserChannelCount(userId: string): Promise<number>;
    suspendChannel(id: string, reason: string): Promise<Channel>;
    unsuspendChannel(id: string): Promise<Channel>;
    deleteChannelPermanently(id: string): Promise<void>;
    getAllChannelsForAdmin(page?: number, limit?: number, search?: string): Promise<{
        channels: Channel[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getChannelStats(): Promise<{
        totalChannels: number;
        activeChannels: number;
        suspendedChannels: number;
    }>;
}
