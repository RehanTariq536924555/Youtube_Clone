import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { WatchLaterService } from './watch-later.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('watch-later')
@UseGuards(JwtAuthGuard)
export class WatchLaterController {
  constructor(private readonly watchLaterService: WatchLaterService) {}

  @Post('toggle/:videoId')
  async toggleWatchLater(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    return this.watchLaterService.toggleWatchLater(userId, videoId);
  }

  @Post(':videoId')
  async addToWatchLater(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    return this.watchLaterService.addToWatchLater(userId, videoId);
  }

  @Delete(':videoId')
  async removeFromWatchLater(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    await this.watchLaterService.removeFromWatchLater(userId, videoId);
    return { message: 'Removed from Watch Later' };
  }

  @Get()
  async getWatchLaterVideos(@Request() req) {
    const userId = req.user.id;
    return this.watchLaterService.getWatchLaterVideos(userId);
  }

  @Get('check/:videoId')
  async checkWatchLater(@Request() req, @Param('videoId') videoId: string) {
    const userId = req.user.id;
    const isInWatchLater = await this.watchLaterService.isInWatchLater(userId, videoId);
    return { isInWatchLater };
  }

  @Get('count')
  async getWatchLaterCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.watchLaterService.getWatchLaterCount(userId);
    return { count };
  }
}
