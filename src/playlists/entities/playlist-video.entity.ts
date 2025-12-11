import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('playlist_videos')
export class PlaylistVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  playlistId: string;

  @Column({ type: 'uuid' })
  videoId: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @ManyToOne(() => Playlist, playlist => playlist.playlistVideos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlistId' })
  playlist: Playlist;

  @ManyToOne(() => Video, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' })
  video: Video;

  @CreateDateColumn()
  addedAt: Date;
}
