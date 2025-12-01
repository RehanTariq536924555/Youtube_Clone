import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchLater } from './entities/watch-later.entity';

@Injectable()
export class WatchLaterService {
  constructor(
    @InjectRepository(WatchLater)
    private watchLaterRepository: Repository<WatchLater>,
  ) {}

  async addToWatchLater(userId: string, videoId: string): Promise<WatchLater> {
    // Check if already exists
    const existing = await this.watchLaterRepository.findOne({
      where: { userId, videoId },
    });

    if (existing) {
      throw new ConflictException('Video already in Watch Later');
    }

    const watchLater = this.watchLaterRepository.create({
      userId,
      videoId,
    });

    return this.watchLaterRepository.save(watchLater);
  }

  async removeFromWatchLater(userId: string, videoId: string): Promise<void> {
    const watchLater = await this.watchLaterRepository.findOne({
      where: { userId, videoId },
    });

    if (!watchLater) {
      throw new NotFoundException('Video not found in Watch Later');
    }

    await this.watchLaterRepository.remove(watchLater);
  }

  async toggleWatchLater(userId: string, videoId: string): Promise<{ added: boolean; message: string }> {
    const existing = await this.watchLaterRepository.findOne({
      where: { userId, videoId },
    });

    if (existing) {
      await this.watchLaterRepository.remove(existing);
      return { added: false, message: 'Removed from Watch Later' };
    } else {
      await this.addToWatchLater(userId, videoId);
      return { added: true, message: 'Added to Watch Later' };
    }
  }

  async getWatchLaterVideos(userId: string) {
    const watchLaterItems = await this.watchLaterRepository.find({
      where: { userId },
      relations: ['video', 'video.user'],
      order: { addedAt: 'DESC' },
    });

    return watchLaterItems.map(item => ({
      ...item.video,
      addedAt: item.addedAt,
    }));
  }

  async isInWatchLater(userId: string, videoId: string): Promise<boolean> {
    const count = await this.watchLaterRepository.count({
      where: { userId, videoId },
    });
    return count > 0;
  }

  async getWatchLaterCount(userId: string): Promise<number> {
    return this.watchLaterRepository.count({
      where: { userId },
    });
  }
}
