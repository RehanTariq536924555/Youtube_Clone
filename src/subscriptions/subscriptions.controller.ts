import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('toggle/:channelId')
  @UseGuards(JwtAuthGuard)
  async toggleSubscription(@Param('channelId') channelId: string, @Request() req) {
    return this.subscriptionsService.toggleSubscription(req.user.id, channelId);
  }

  @Get('check/:channelId')
  @UseGuards(JwtAuthGuard)
  async isSubscribed(@Param('channelId') channelId: string, @Request() req) {
    const isSubscribed = await this.subscriptionsService.isSubscribed(req.user.id, channelId);
    return { isSubscribed };
  }

  @Get('my-subscriptions')
  @UseGuards(JwtAuthGuard)
  async getMySubscriptions(@Request() req) {
    return this.subscriptionsService.getSubscriptions(req.user.id);
  }

  @Get('subscribers/:channelId')
  async getSubscribers(@Param('channelId') channelId: string) {
    return this.subscriptionsService.getSubscribers(channelId);
  }

  @Get('count/:channelId')
  async getSubscriberCount(@Param('channelId') channelId: string) {
    const count = await this.subscriptionsService.getSubscriberCount(channelId);
    return { count };
  }

  @Patch('notifications/:channelId')
  @UseGuards(JwtAuthGuard)
  async updateNotifications(
    @Param('channelId') channelId: string,
    @Body('notificationsEnabled') notificationsEnabled: boolean,
    @Request() req,
  ) {
    return this.subscriptionsService.updateNotificationSettings(
      req.user.id,
      channelId,
      notificationsEnabled,
    );
  }
}