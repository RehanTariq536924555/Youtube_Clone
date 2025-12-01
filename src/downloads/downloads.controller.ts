import { Controller, Post, Get, Delete, Param, UseGuards, Request, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VideosService } from '../videos/videos.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('downloads')
@UseGuards(JwtAuthGuard)
export class DownloadsController {
  constructor(
    private readonly downloadsService: DownloadsService,
    private readonly videosService: VideosService,
  ) {}

  @Post('record/:videoId')
  async recordDownload(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    await this.downloadsService.recordDownload(userId, videoId);
    return { message: 'Download recorded' };
  }

  @Get()
  async getDownloads(@Request() req) {
    const userId = req.user.id;
    return this.downloadsService.getDownloads(userId);
  }

  @Delete(':videoId')
  async removeDownload(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    await this.downloadsService.removeDownload(userId, videoId);
    return { message: 'Download removed from history' };
  }

  @Get('count')
  async getDownloadCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.downloadsService.getDownloadCount(userId);
    return { count };
  }

  @Get('file/:videoId')
  async downloadVideo(
    @Request() req,
    @Param('videoId') videoId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const userId = req.user.id;
    
    // Get video details
    const video = await this.videosService.findOne(videoId);
    
    // Record the download
    await this.downloadsService.recordDownload(userId, videoId);
    
    // Set response headers for download
    res.set({
      'Content-Type': video.mimeType,
      'Content-Disposition': `attachment; filename="${video.originalName}"`,
    });
    
    // Stream the video file
    const filePath = join(process.cwd(), 'uploads', 'videos', video.filename);
    const file = createReadStream(filePath);
    
    return new StreamableFile(file);
  }
}
