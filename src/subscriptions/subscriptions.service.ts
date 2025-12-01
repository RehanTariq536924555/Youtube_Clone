import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async toggleSubscription(subscriberId: string, channelId: string): Promise<{ action: string; subscription?: Subscription }> {
    if (subscriberId === channelId) {
      throw new BadRequestException('You cannot subscribe to yourself');
    }

    // Check if subscription already exists
    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: { subscriberId, channelId },
    });

    if (existingSubscription) {
      // Unsubscribe
      await this.subscriptionsRepository.remove(existingSubscription);
      await this.updateSubscriberCount(channelId, 'decrement');
      return { action: 'unsubscribed' };
    } else {
      // Subscribe
      const subscription = this.subscriptionsRepository.create({
        subscriberId,
        channelId,
      });
      const savedSubscription = await this.subscriptionsRepository.save(subscription);
      await this.updateSubscriberCount(channelId, 'increment');
      return { action: 'subscribed', subscription: savedSubscription };
    }
  }

  async isSubscribed(subscriberId: string, channelId: string): Promise<boolean> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { subscriberId, channelId },
    });
    return !!subscription;
  }

  async getSubscriptions(subscriberId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { subscriberId },
      relations: ['channel'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSubscribers(channelId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { channelId },
      relations: ['subscriber'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSubscriberCount(channelId: string): Promise<number> {
    return this.subscriptionsRepository.count({
      where: { channelId },
    });
  }

  private async updateSubscriberCount(channelId: string, action: 'increment' | 'decrement'): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: channelId } });
    if (user) {
      if (action === 'increment') {
        user.subscribersCount++;
      } else {
        user.subscribersCount = Math.max(0, user.subscribersCount - 1);
      }
      await this.usersRepository.save(user);
    }
  }

  async updateNotificationSettings(subscriberId: string, channelId: string, notificationsEnabled: boolean): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { subscriberId, channelId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.notificationsEnabled = notificationsEnabled;
    return this.subscriptionsRepository.save(subscription);
  }
}