import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(userId: string, createChannelDto: CreateChannelDto): Promise<Channel> {
    // Check if handle already exists
    const existingChannel = await this.channelRepository.findOne({
      where: { handle: createChannelDto.handle },
    });

    if (existingChannel) {
      throw new ConflictException('Channel handle already exists');
    }

    const channel = this.channelRepository.create({
      ...createChannelDto,
      userId,
    });

    return await this.channelRepository.save(channel);
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [channels, total] = await this.channelRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { subscribersCount: 'DESC' },
      relations: ['user'],
    });

    return {
      channels,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string): Promise<Channel[]> {
    return await this.channelRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['user', 'videos'],
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async findByHandle(handle: string): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { handle },
      relations: ['user'],
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async update(id: string, userId: string, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const channel = await this.findOne(id);

    if (channel.userId !== userId) {
      throw new ForbiddenException('You can only update your own channels');
    }

    if (channel.isSuspended) {
      throw new ForbiddenException('Cannot update suspended channel');
    }

    Object.assign(channel, updateChannelDto);
    return await this.channelRepository.save(channel);
  }

  async remove(id: string, userId: string): Promise<void> {
    const channel = await this.findOne(id);

    if (channel.userId !== userId) {
      throw new ForbiddenException('You can only delete your own channels');
    }

    channel.isActive = false;
    await this.channelRepository.save(channel);
  }

  async getUserChannelCount(userId: string): Promise<number> {
    return await this.channelRepository.count({
      where: { userId, isActive: true },
    });
  }

  // Admin methods
  async suspendChannel(id: string, reason: string): Promise<Channel> {
    const channel = await this.findOne(id);
    channel.isSuspended = true;
    channel.suspensionReason = reason;
    return await this.channelRepository.save(channel);
  }

  async unsuspendChannel(id: string): Promise<Channel> {
    const channel = await this.findOne(id);
    channel.isSuspended = false;
    channel.suspensionReason = null;
    return await this.channelRepository.save(channel);
  }

  async deleteChannelPermanently(id: string): Promise<void> {
    // First, check if channel exists
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    // Update all videos to remove channel reference (set channelId to null)
    // This prevents foreign key constraint violation
    if (channel.videos && channel.videos.length > 0) {
      await this.channelRepository
        .createQueryBuilder()
        .relation(Channel, 'videos')
        .of(channel)
        .loadMany()
        .then(async (videos) => {
          // Set channelId to null for all videos
          for (const video of videos) {
            video.channelId = null;
          }
        });
      
      // Alternative: Use raw query to update videos
      await this.channelRepository.query(
        'UPDATE videos SET "channelId" = NULL WHERE "channelId" = $1',
        [id]
      );
    }

    // Now delete the channel
    const result = await this.channelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Channel not found');
    }
  }

  async getAllChannelsForAdmin(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [channels, total] = await this.channelRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'videos'],
      select: {
        id: true,
        name: true,
        handle: true,
        description: true,
        avatar: true,
        banner: true,
        userId: true,
        subscribersCount: true,
        videosCount: true,
        totalViews: true,
        isSuspended: true,
        suspensionReason: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    return {
      channels,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getChannelStats() {
    const totalChannels = await this.channelRepository.count();
    const activeChannels = await this.channelRepository.count({ where: { isActive: true } });
    const suspendedChannels = await this.channelRepository.count({ where: { isSuspended: true } });

    return {
      totalChannels,
      activeChannels,
      suspendedChannels,
    };
  }
}
