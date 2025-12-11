import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeType, LikeableType } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { VideosService } from '../videos/videos.service';
import { CommentsService } from '../comments/comments.service';
import { PlaylistsService } from '../playlists/playlists.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @Inject(forwardRef(() => VideosService))
    private videosService: VideosService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @Inject(forwardRef(() => PlaylistsService))
    private playlistsService: PlaylistsService,
  ) {}

  async toggleLike(createLikeDto: CreateLikeDto, userId: string): Promise<{ action: string; like?: Like }> {
    const { targetId, targetType, type } = createLikeDto;

    // Check if user already liked/disliked this target
    const existingLike = await this.likesRepository.findOne({
      where: { userId, targetId, targetType },
    });

    if (existingLike) {
      if (existingLike.type === type) {
        // Same action - remove the like/dislike
        await this.updateTargetCounts(targetId, targetType, existingLike.type, 'decrement');
        await this.likesRepository.remove(existingLike);
        
        // Remove from Liked Videos playlist if it's a video like
        if (targetType === LikeableType.VIDEO && type === LikeType.LIKE) {
          await this.playlistsService.removeFromLikedVideos(userId, targetId);
        }
        
        return { action: 'removed' };
      } else {
        // Different action - update the existing like
        await this.updateTargetCounts(targetId, targetType, existingLike.type, 'decrement');
        existingLike.type = type;
        await this.updateTargetCounts(targetId, targetType, type, 'increment');
        const updatedLike = await this.likesRepository.save(existingLike);
        
        // Handle playlist changes for videos
        if (targetType === LikeableType.VIDEO) {
          if (type === LikeType.LIKE) {
            // Changed from dislike to like - add to playlist
            await this.playlistsService.addToLikedVideos(userId, targetId);
          } else {
            // Changed from like to dislike - remove from playlist
            await this.playlistsService.removeFromLikedVideos(userId, targetId);
          }
        }
        
        return { action: 'updated', like: updatedLike };
      }
    } else {
      // New like/dislike
      const like = this.likesRepository.create({
        userId,
        targetId,
        targetType,
        type,
      });
      await this.updateTargetCounts(targetId, targetType, type, 'increment');
      const savedLike = await this.likesRepository.save(like);
      
      // Add to Liked Videos playlist if it's a video like
      if (targetType === LikeableType.VIDEO && type === LikeType.LIKE) {
        await this.playlistsService.addToLikedVideos(userId, targetId);
      }
      
      return { action: 'created', like: savedLike };
    }
  }

  private async updateTargetCounts(
    targetId: string,
    targetType: LikeableType,
    likeType: LikeType,
    action: 'increment' | 'decrement'
  ): Promise<void> {
    try {
      if (targetType === LikeableType.VIDEO) {
        if (likeType === LikeType.LIKE) {
          if (action === 'increment') {
            await this.videosService.incrementLikes(targetId);
          } else {
            await this.videosService.decrementLikes(targetId);
          }
        } else {
          if (action === 'increment') {
            await this.videosService.incrementDislikes(targetId);
          } else {
            await this.videosService.decrementDislikes(targetId);
          }
        }
      } else if (targetType === LikeableType.COMMENT) {
        if (likeType === LikeType.LIKE) {
          if (action === 'increment') {
            await this.commentsService.incrementLikes(targetId);
          } else {
            await this.commentsService.decrementLikes(targetId);
          }
        } else {
          if (action === 'increment') {
            await this.commentsService.incrementDislikes(targetId);
          } else {
            await this.commentsService.decrementDislikes(targetId);
          }
        }
      }
    } catch (error) {
      console.error('Error updating target counts:', error);
    }
  }

  async getUserLike(userId: string, targetId: string, targetType: LikeableType): Promise<Like | null> {
    return this.likesRepository.findOne({
      where: { userId, targetId, targetType },
    });
  }

  async getTargetLikes(targetId: string, targetType: LikeableType): Promise<{ likes: number; dislikes: number }> {
    const likes = await this.likesRepository.count({
      where: { targetId, targetType, type: LikeType.LIKE },
    });

    const dislikes = await this.likesRepository.count({
      where: { targetId, targetType, type: LikeType.DISLIKE },
    });

    return { likes, dislikes };
  }
}