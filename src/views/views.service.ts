import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from './entities/view.entity';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private viewsRepository: Repository<View>,
    @Inject(forwardRef(() => VideosService))
    private videosService: VideosService,
  ) {}

  async recordView(videoId: string, userId?: string, ipAddress?: string): Promise<View> {
    console.log('Recording view - videoId:', videoId, 'userId:', userId, 'ipAddress:', ipAddress);
    
    // Check if view already exists for this user/IP
    let existingView: View | null = null;
    
    if (userId) {
      existingView = await this.viewsRepository.findOne({
        where: { videoId, userId },
      });
      console.log('Existing view for user:', existingView ? 'Found' : 'Not found');
    } else if (ipAddress) {
      existingView = await this.viewsRepository.findOne({
        where: { videoId, ipAddress },
      });
      console.log('Existing view for IP:', existingView ? 'Found' : 'Not found');
    }

    if (existingView) {
      // Update existing view - update the timestamp by touching it
      console.log('Updating existing view:', existingView.id);
      existingView.watchTime = 0; // Reset watch time for new session
      existingView.completed = false;
      // Force update of createdAt by removing and recreating
      await this.viewsRepository.remove(existingView);
      const newView = this.viewsRepository.create({
        videoId,
        userId,
        ipAddress,
      });
      return this.viewsRepository.save(newView);
    } else {
      // Create new view and increment video view count
      console.log('Creating new view');
      const view = this.viewsRepository.create({
        videoId,
        userId,
        ipAddress,
      });
      
      await this.videosService.incrementViews(videoId);
      const savedView = await this.viewsRepository.save(view);
      console.log('View saved:', savedView.id);
      return savedView;
    }
  }

  async updateWatchTime(viewId: string, watchTime: number, completed: boolean = false): Promise<View> {
    const view = await this.viewsRepository.findOne({ where: { id: viewId } });
    if (view) {
      view.watchTime = watchTime;
      view.completed = completed;
      return this.viewsRepository.save(view);
    }
    throw new Error('View not found');
  }

  async getVideoViews(videoId: string): Promise<number> {
    return this.viewsRepository.count({ where: { videoId } });
  }

  async getUserViewHistory(userId: string): Promise<View[]> {
    console.log('Getting view history for user:', userId);
    const views = await this.viewsRepository.find({
      where: { userId },
      relations: ['video', 'video.user'],
      order: { createdAt: 'DESC' },
    });
    console.log('Found', views.length, 'views for user');
    return views;
  }

  async deleteView(viewId: string, userId: string): Promise<void> {
    const view = await this.viewsRepository.findOne({
      where: { id: viewId, userId },
    });
    
    if (!view) {
      throw new Error('View not found or unauthorized');
    }
    
    await this.viewsRepository.remove(view);
  }

  async clearAllHistory(userId: string): Promise<void> {
    await this.viewsRepository.delete({ userId });
  }
}