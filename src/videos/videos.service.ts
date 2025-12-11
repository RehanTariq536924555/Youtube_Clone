import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoVisibility } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Channel } from '../channels/entities/channel.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(
    createVideoDto: CreateVideoDto,
    file: Express.Multer.File,
    userId: string,
    thumbnailFile?: Express.Multer.File,
  ): Promise<Video> {
    // Check if channel is provided and validate it
    if (createVideoDto.channelId) {
      const channel = await this.channelRepository.findOne({
        where: { id: createVideoDto.channelId },
      });

      if (!channel) {
        throw new NotFoundException('Channel not found');
      }

      // Check if user owns the channel
      if (channel.userId !== userId) {
        throw new ForbiddenException('You can only upload videos to your own channels');
      }

      // Check if channel is suspended
      if (channel.isSuspended) {
        throw new ForbiddenException(
          `Cannot upload videos to suspended channel. Reason: ${channel.suspensionReason || 'Channel has been suspended by admin'}`
        );
      }

      // Check if channel is active
      if (!channel.isActive) {
        throw new BadRequestException('Cannot upload videos to inactive channel');
      }
    }

    const video = this.videosRepository.create({
      ...createVideoDto,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      userId,
      channelId: createVideoDto.channelId || null,
      visibility: createVideoDto.visibility || VideoVisibility.PUBLIC,
      thumbnail: thumbnailFile ? thumbnailFile.filename : null,
      tags: createVideoDto.tags && createVideoDto.tags.length > 0 ? createVideoDto.tags : null,
      isShort: createVideoDto.isShort || false,
    });

    return this.videosRepository.save(video);
  }

  async findAll(userId?: string): Promise<Video[]> {
    const queryBuilder = this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user');

    // Always filter out suspended videos for regular users
    queryBuilder.andWhere('video.isSuspended = :isSuspended', { isSuspended: false });

    if (userId) {
      // If userId is provided, show all videos for that user
      queryBuilder.where('video.userId = :userId', { userId });
      // Still filter suspended videos even for owner
      queryBuilder.andWhere('video.isSuspended = :isSuspended', { isSuspended: false });
    } else {
      // If no userId, only show public videos
      queryBuilder.where('video.visibility = :visibility', {
        visibility: VideoVisibility.PUBLIC,
      });
    }

    return queryBuilder
      .orderBy('video.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId?: string): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check if video is suspended (hide from regular users)
    if (video.isSuspended && video.userId !== userId) {
      throw new NotFoundException('Video not found');
    }

    // Check if user can access this video
    if (video.visibility === VideoVisibility.PRIVATE && video.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return video;
  }

  async update(
    id: string,
    updateVideoDto: UpdateVideoDto,
    userId: string,
  ): Promise<Video> {
    const video = await this.findOne(id, userId);

    if (video.userId !== userId) {
      throw new ForbiddenException('You can only update your own videos');
    }

    Object.assign(video, updateVideoDto);
    return this.videosRepository.save(video);
  }

  async remove(id: string, userId: string): Promise<void> {
    const video = await this.findOne(id, userId);

    if (video.userId !== userId) {
      throw new ForbiddenException('You can only delete your own videos');
    }

    // Delete the file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', 'videos', video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete thumbnail if exists
    if (video.thumbnail) {
      const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', video.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await this.videosRepository.remove(video);
  }

  async findUserVideos(userId: string): Promise<Video[]> {
    // Show user their own videos including suspended ones (so they know)
    return this.videosRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async incrementViews(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.viewsCount++;
    return this.videosRepository.save(video);
  }

  async incrementLikes(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.likesCount++;
    return this.videosRepository.save(video);
  }

  async decrementLikes(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.likesCount = Math.max(0, video.likesCount - 1);
    return this.videosRepository.save(video);
  }

  async incrementDislikes(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.dislikesCount++;
    return this.videosRepository.save(video);
  }

  async decrementDislikes(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.dislikesCount = Math.max(0, video.dislikesCount - 1);
    return this.videosRepository.save(video);
  }

  async incrementComments(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.commentsCount++;
    return this.videosRepository.save(video);
  }

  async decrementComments(id: string): Promise<Video> {
    const video = await this.findOne(id);
    video.commentsCount = Math.max(0, video.commentsCount - 1);
    return this.videosRepository.save(video);
  }

  async searchVideos(query: string): Promise<Video[]> {
    return this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.visibility = :visibility', { visibility: VideoVisibility.PUBLIC })
      .andWhere(
        '(LOWER(video.title) LIKE LOWER(:query) OR LOWER(video.description) LIKE LOWER(:query) OR LOWER(video.category) LIKE LOWER(:query))',
        { query: `%${query.toLowerCase()}%` }
      )
      .orderBy('video.createdAt', 'DESC')
      .getMany();
  }

  async findByCategory(category: string): Promise<Video[]> {
    return this.videosRepository.find({
      where: { 
        category,
        visibility: VideoVisibility.PUBLIC,
        isSuspended: false
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findTrending(): Promise<Video[]> {
    // Get videos from last 7 days, ordered by views
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.visibility = :visibility', { visibility: VideoVisibility.PUBLIC })
      .andWhere('video.isSuspended = :isSuspended', { isSuspended: false })
      .andWhere('video.createdAt >= :date', { date: sevenDaysAgo })
      .orderBy('video.viewsCount', 'DESC')
      .addOrderBy('video.likesCount', 'DESC')
      .limit(50)
      .getMany();
  }

  // Shorts-specific methods
  async findAllShorts(userId?: string): Promise<Video[]> {
    const queryBuilder = this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.isShort = :isShort', { isShort: true })
      .andWhere('video.isSuspended = :isSuspended', { isSuspended: false });

    if (userId) {
      // If userId is provided, show all shorts for that user
      queryBuilder.andWhere('video.userId = :userId', { userId });
    } else {
      // If no userId, only show public shorts
      queryBuilder.andWhere('video.visibility = :visibility', {
        visibility: VideoVisibility.PUBLIC,
      });
    }

    return queryBuilder
      .orderBy('video.createdAt', 'DESC')
      .getMany();
  }

  async findTrendingShorts(): Promise<Video[]> {
    // Get shorts from last 3 days, ordered by views and engagement
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.isShort = :isShort', { isShort: true })
      .andWhere('video.visibility = :visibility', { visibility: VideoVisibility.PUBLIC })
      .andWhere('video.isSuspended = :isSuspended', { isSuspended: false })
      .andWhere('video.createdAt >= :date', { date: threeDaysAgo })
      .orderBy('video.viewsCount', 'DESC')
      .addOrderBy('video.likesCount', 'DESC')
      .addOrderBy('video.commentsCount', 'DESC')
      .limit(100)
      .getMany();
  }

  async markAsShort(id: string, userId: string): Promise<Video> {
    const video = await this.findOne(id, userId);

    if (video.userId !== userId) {
      throw new ForbiddenException('You can only modify your own videos');
    }

    video.isShort = true;
    return this.videosRepository.save(video);
  }

  async autoDetectShorts(): Promise<void> {
    // Auto-detect shorts based on duration (60 seconds or less)
    await this.videosRepository
      .createQueryBuilder()
      .update(Video)
      .set({ isShort: true })
      .where('duration <= :maxDuration', { maxDuration: 60 })
      .andWhere('isShort = :isShort', { isShort: false })
      .execute();
  }
}