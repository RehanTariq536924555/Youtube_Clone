import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  BadRequestException,
  Res,
  StreamableFile,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { StreamLogger } from '../common/utils/logger.util';



@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadPath: string;
          if (file.fieldname === 'video') {
            uploadPath = path.join(process.cwd(), 'uploads', 'videos');
          } else if (file.fieldname === 'thumbnail') {
            uploadPath = path.join(process.cwd(), 'uploads', 'thumbnails');
          } else {
            return cb(new BadRequestException('Invalid file field'), '');
          }
          
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Invalid file type for ${file.fieldname}`), false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit for large videos
      },
    }),
  )
  async uploadVideo(
    @UploadedFiles() files: { video?: Express.Multer.File[], thumbnail?: Express.Multer.File[] },
    @Body() createVideoDto: CreateVideoDto,
    @Request() req,
  ) {
    if (!files.video || files.video.length === 0) {
      throw new BadRequestException('Video file is required');
    }

    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail?.[0];

    const video = await this.videosService.create(
      createVideoDto,
      videoFile,
      req.user.id,
      thumbnailFile,
    );

    return {
      message: 'Video uploaded successfully',
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        visibility: video.visibility,
        filename: video.filename,
        originalName: video.originalName,
        size: video.size,
        thumbnail: video.thumbnail,
        createdAt: video.createdAt,
      },
    };
  }

  @Get('test-auth')
  @UseGuards(JwtAuthGuard)
  async testAuth(@Request() req) {
    return { 
      message: 'Authentication successful',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id; // Optional user ID for authenticated requests
    return this.videosService.findAll(userId);
  }

  @Get('search')
  async searchVideos(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.videosService.searchVideos(query);
  }

  @Get('trending')
  async getTrending() {
    return this.videosService.findTrending();
  }

  @Get('category/:category')
  async getByCategory(@Param('category') category: string) {
    return this.videosService.findByCategory(category);
  }

  @Get('shorts')
  async getAllShorts(@Request() req) {
    // Don't require authentication for public shorts
    const userId = req.user?.id; // This will be undefined if not authenticated
    return this.videosService.findAllShorts(userId);
  }

  @Get('shorts/trending')
  async getTrendingShorts() {
    return this.videosService.findTrendingShorts();
  }

  @Patch(':id/mark-as-short')
  @UseGuards(JwtAuthGuard)
  async markAsShort(@Param('id') id: string, @Request() req) {
    return this.videosService.markAsShort(id, req.user.id);
  }

  @Get('debug/shorts')
  async debugShorts() {
    try {
      const allVideos = await this.videosService.findAll();
      const shorts = await this.videosService.findAllShorts();
      
      return {
        totalVideos: allVideos.length,
        totalShorts: shorts.length,
        allVideos: allVideos.map(v => ({
          id: v.id,
          title: v.title,
          isShort: v.isShort,
          duration: v.duration,
          visibility: v.visibility
        })),
        shorts: shorts.map(v => ({
          id: v.id,
          title: v.title,
          isShort: v.isShort,
          duration: v.duration,
          visibility: v.visibility
        }))
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Debug endpoint failed'
      };
    }
  }

  @Post('debug/mark-all-shorts')
  async markAllAsShorts() {
    try {
      const allVideos = await this.videosService.findAll();
      let updatedCount = 0;
      
      for (const video of allVideos) {
        // Mark videos as shorts if they're 60 seconds or less, or if duration is null (assume short)
        if (!video.isShort && (video.duration === null || video.duration <= 60)) {
          await this.videosService.markAsShort(video.id, video.userId);
          updatedCount++;
        }
      }
      
      const shorts = await this.videosService.findAllShorts();
      
      return {
        message: `Marked ${updatedCount} videos as shorts`,
        totalShorts: shorts.length,
        updatedVideos: updatedCount
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Failed to mark videos as shorts'
      };
    }
  }

  @Get('my-videos')
  @UseGuards(JwtAuthGuard)
  async findMyVideos(@Request() req) {
    return this.videosService.findUserVideos(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.videosService.findOne(id, userId);
  }

  @Get(':id/stream')
  async streamVideo(
    @Param('id') id: string,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id;
    const video = await this.videosService.findOne(id, userId);
    
    const filePath = path.join(process.cwd(), 'uploads', 'videos', video.filename);
    
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Video file not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for video seeking
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      const file = fs.createReadStream(filePath, { start, end });
      
      // Handle stream errors gracefully
      file.on('error', (error: any) => {
        StreamLogger.logStreamError(error, 'Video Stream (Range)');
      });

      // Handle connection close
      req.on('close', () => {
        if (!file.destroyed) {
          file.destroy();
        }
      });

      req.on('aborted', () => {
        if (!file.destroyed) {
          file.destroy();
        }
      });

      res.set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.mimeType,
      });
      
      res.status(206);
      return new StreamableFile(file);
    } else {
      // Full file stream
      const file = fs.createReadStream(filePath);
      
      // Handle stream errors gracefully
      file.on('error', (error: any) => {
        StreamLogger.logStreamError(error, 'Video Stream (Full)');
      });

      // Handle connection close
      req.on('close', () => {
        if (!file.destroyed) {
          file.destroy();
        }
      });

      req.on('aborted', () => {
        if (!file.destroyed) {
          file.destroy();
        }
      });

      res.set({
        'Content-Type': video.mimeType,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      });

      return new StreamableFile(file);
    }
  }

  @Get(':id/thumbnail')
  async getThumbnail(
    @Param('id') id: string,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id;
    const video = await this.videosService.findOne(id, userId);
    
    if (!video.thumbnail) {
      throw new BadRequestException('No thumbnail available for this video');
    }

    const thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', video.thumbnail);
    
    if (!fs.existsSync(thumbnailPath)) {
      throw new BadRequestException('Thumbnail file not found');
    }

    const file = fs.createReadStream(thumbnailPath);
    const stat = fs.statSync(thumbnailPath);

    // Handle stream errors gracefully
    file.on('error', (error: any) => {
      StreamLogger.logStreamError(error, 'Thumbnail Stream');
    });

    // Handle connection close
    req.on('close', () => {
      if (!file.destroyed) {
        file.destroy();
      }
    });

    req.on('aborted', () => {
      if (!file.destroyed) {
        file.destroy();
      }
    });

    // Determine content type based on file extension
    const ext = path.extname(video.thumbnail).toLowerCase();
    let contentType = 'image/jpeg'; // default
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    res.set({
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });

    return new StreamableFile(file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @Request() req,
  ) {
    return this.videosService.update(id, updateVideoDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    await this.videosService.remove(id, req.user.id);
    return { message: 'Video deleted successfully' };
  }
}