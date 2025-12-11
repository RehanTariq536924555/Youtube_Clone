import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist, PlaylistVisibility, SystemPlaylistType } from './entities/playlist.entity';
import { PlaylistVideo } from './entities/playlist-video.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistVideo)
    private playlistVideoRepository: Repository<PlaylistVideo>,
  ) {}

  // Create a new playlist
  async create(userId: string, createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      ...createPlaylistDto,
      userId,
      visibility: createPlaylistDto.visibility || PlaylistVisibility.PUBLIC,
    });

    return await this.playlistRepository.save(playlist);
  }

  // Get all playlists for a user
  async findByUser(userId: string): Promise<Playlist[]> {
    return await this.playlistRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get a single playlist with videos
  async findOne(id: string, userId?: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['user', 'playlistVideos', 'playlistVideos.video', 'playlistVideos.video.user'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Check visibility permissions
    if (playlist.visibility === PlaylistVisibility.PRIVATE && playlist.userId !== userId) {
      throw new ForbiddenException('This playlist is private');
    }

    // Sort videos by position
    if (playlist.playlistVideos) {
      playlist.playlistVideos.sort((a, b) => a.position - b.position);
    }

    return playlist;
  }

  // Update playlist
  async update(id: string, userId: string, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({ where: { id } });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only update your own playlists');
    }

    if (playlist.isSystemPlaylist) {
      throw new ForbiddenException('Cannot modify system playlists');
    }

    Object.assign(playlist, updatePlaylistDto);
    return await this.playlistRepository.save(playlist);
  }

  // Delete playlist
  async remove(id: string, userId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id } });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only delete your own playlists');
    }

    if (playlist.isSystemPlaylist) {
      throw new ForbiddenException('Cannot delete system playlists');
    }

    await this.playlistRepository.remove(playlist);
  }

  // Add video to playlist
  async addVideo(playlistId: string, videoId: string, userId: string, position?: number): Promise<PlaylistVideo> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only add videos to your own playlists');
    }

    // Check if video already in playlist
    const existing = await this.playlistVideoRepository.findOne({
      where: { playlistId, videoId },
    });

    if (existing) {
      throw new ConflictException('Video already in playlist');
    }

    // Get next position if not provided
    if (position === undefined) {
      const maxPosition = await this.playlistVideoRepository
        .createQueryBuilder('pv')
        .select('MAX(pv.position)', 'max')
        .where('pv.playlistId = :playlistId', { playlistId })
        .getRawOne();
      
      position = (maxPosition?.max || -1) + 1;
    }

    const playlistVideo = this.playlistVideoRepository.create({
      playlistId,
      videoId,
      position,
    });

    await this.playlistVideoRepository.save(playlistVideo);

    // Update playlist videos count
    playlist.videosCount = await this.playlistVideoRepository.count({ where: { playlistId } });
    await this.playlistRepository.save(playlist);

    return playlistVideo;
  }

  // Remove video from playlist
  async removeVideo(playlistId: string, videoId: string, userId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenException('You can only remove videos from your own playlists');
    }

    const playlistVideo = await this.playlistVideoRepository.findOne({
      where: { playlistId, videoId },
    });

    if (!playlistVideo) {
      throw new NotFoundException('Video not in playlist');
    }

    await this.playlistVideoRepository.remove(playlistVideo);

    // Update playlist videos count
    playlist.videosCount = await this.playlistVideoRepository.count({ where: { playlistId } });
    await this.playlistRepository.save(playlist);

    // Reorder remaining videos
    await this.reorderVideos(playlistId);
  }

  // Reorder videos in playlist
  private async reorderVideos(playlistId: string): Promise<void> {
    const videos = await this.playlistVideoRepository.find({
      where: { playlistId },
      order: { position: 'ASC' },
    });

    for (let i = 0; i < videos.length; i++) {
      videos[i].position = i;
      await this.playlistVideoRepository.save(videos[i]);
    }
  }

  // Get or create system playlist (like "Liked Videos")
  async getOrCreateSystemPlaylist(userId: string, type: SystemPlaylistType): Promise<Playlist> {
    let playlist = await this.playlistRepository.findOne({
      where: { userId, systemPlaylistType: type, isSystemPlaylist: true },
    });

    if (!playlist) {
      const playlistData = this.getSystemPlaylistData(type);
      playlist = this.playlistRepository.create({
        userId,
        ...playlistData,
        isSystemPlaylist: true,
        systemPlaylistType: type,
        visibility: PlaylistVisibility.PRIVATE,
      });
      playlist = await this.playlistRepository.save(playlist);
    }

    return playlist;
  }

  private getSystemPlaylistData(type: SystemPlaylistType): { name: string; description: string } {
    switch (type) {
      case SystemPlaylistType.LIKED_VIDEOS:
        return {
          name: 'Liked Videos',
          description: 'Videos you have liked',
        };
      case SystemPlaylistType.WATCH_LATER:
        return {
          name: 'Watch Later',
          description: 'Videos to watch later',
        };
      case SystemPlaylistType.FAVORITES:
        return {
          name: 'Favorites',
          description: 'Your favorite videos',
        };
      default:
        return {
          name: 'System Playlist',
          description: 'System generated playlist',
        };
    }
  }

  // Add video to "Liked Videos" when user likes a video
  async addToLikedVideos(userId: string, videoId: string): Promise<void> {
    const playlist = await this.getOrCreateSystemPlaylist(userId, SystemPlaylistType.LIKED_VIDEOS);
    
    try {
      await this.addVideo(playlist.id, videoId, userId);
    } catch (error) {
      // Ignore if already in playlist
      if (!(error instanceof ConflictException)) {
        throw error;
      }
    }
  }

  // Remove video from "Liked Videos" when user unlikes
  async removeFromLikedVideos(userId: string, videoId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      where: { userId, systemPlaylistType: SystemPlaylistType.LIKED_VIDEOS },
    });

    if (playlist) {
      try {
        await this.removeVideo(playlist.id, videoId, userId);
      } catch (error) {
        // Ignore if not in playlist
      }
    }
  }

  // Get public playlists
  async findPublicPlaylists(page: number = 1, limit: number = 20): Promise<{ playlists: Playlist[]; total: number }> {
    const skip = (page - 1) * limit;

    const [playlists, total] = await this.playlistRepository.findAndCount({
      where: { visibility: PlaylistVisibility.PUBLIC, isSystemPlaylist: false },
      relations: ['user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { playlists, total };
  }
}
