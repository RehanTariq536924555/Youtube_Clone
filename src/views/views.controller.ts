import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post('record/:videoId')
  @UseGuards(JwtAuthGuard)
  async recordView(
    @Param('videoId') videoId: string,
    @Request() req,
    @Ip() ip: string,
  ) {
    // Extract userId from authenticated user
    const userId = req.user?.id;
    console.log('Recording view for video:', videoId, 'userId:', userId, 'ip:', ip);
    
    if (!userId) {
      console.error('No user ID found in request!');
      throw new Error('Authentication required');
    }
    
    const view = await this.viewsService.recordView(videoId, userId, ip);
    console.log('View recorded:', view);
    return view;
  }

  @Patch(':id/watch-time')
  async updateWatchTime(
    @Param('id') id: string,
    @Body('watchTime') watchTime: number,
    @Body('completed') completed: boolean = false,
  ) {
    return this.viewsService.updateWatchTime(id, watchTime, completed);
  }

  @Get('video/:videoId/count')
  async getVideoViews(@Param('videoId') videoId: string) {
    const count = await this.viewsService.getVideoViews(videoId);
    return { count };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getUserViewHistory(@Request() req) {
    return this.viewsService.getUserViewHistory(req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteView(@Param('id') id: string, @Request() req) {
    await this.viewsService.deleteView(id, req.user.id);
    return { message: 'View deleted successfully' };
  }

  @Delete('history/clear')
  @UseGuards(JwtAuthGuard)
  async clearAllHistory(@Request() req) {
    await this.viewsService.clearAllHistory(req.user.id);
    return { message: 'History cleared successfully' };
  }
}