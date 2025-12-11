import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ChannelsService } from '../channels/channels.service';

@Controller('admin/channels')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  getAllChannels(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.channelsService.getAllChannelsForAdmin(+page, +limit, search);
  }

  @Get('stats')
  getChannelStats() {
    return this.channelsService.getChannelStats();
  }

  @Get('user/:userId')
  getUserChannels(@Param('userId') userId: string) {
    return this.channelsService.findByUser(userId);
  }

  @Get('user/:userId/count')
  getUserChannelCount(@Param('userId') userId: string) {
    return this.channelsService.getUserChannelCount(userId);
  }

  @Get(':id')
  getChannelDetails(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Post(':id/suspend')
  suspendChannel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.channelsService.suspendChannel(id, reason);
  }

  @Post(':id/unsuspend')
  unsuspendChannel(@Param('id') id: string) {
    return this.channelsService.unsuspendChannel(id);
  }

  @Delete(':id')
  deleteChannel(@Param('id') id: string) {
    return this.channelsService.deleteChannelPermanently(id);
  }
}
