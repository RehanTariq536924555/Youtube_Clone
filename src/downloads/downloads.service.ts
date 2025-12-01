import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download } from './entities/download.entity';

@Injectable()
export class DownloadsService {
  constructor(
    @InjectRepository(Download)
    private downloadsRepository: Repository<Download>,
  ) {}

  async recordDownload(userId: string, videoId: string): Promise<Download> {
    // Check if already downloaded (to avoid duplicates)
    const existing = await this.downloadsRepository.findOne({
      where: { userId, videoId },
    });

    if (existing) {
      // Update the download timestamp
      existing.downloadedAt = new Date();
      return this.downloadsRepository.save(existing);
    }

    // Create new download record
    const download = this.downloadsRepository.create({
      userId,
      videoId,
    });

    return this.downloadsRepository.save(download);
  }

  async getDownloads(userId: string) {
    const downloads = await this.downloadsRepository.find({
      where: { userId },
      relations: ['video', 'video.user'],
      order: { downloadedAt: 'DESC' },
    });

    return downloads.map(download => ({
      ...download.video,
      downloadedAt: download.downloadedAt,
    }));
  }

  async removeDownload(userId: string, videoId: string): Promise<void> {
    await this.downloadsRepository.delete({ userId, videoId });
  }

  async getDownloadCount(userId: string): Promise<number> {
    return this.downloadsRepository.count({
      where: { userId },
    });
  }
}
