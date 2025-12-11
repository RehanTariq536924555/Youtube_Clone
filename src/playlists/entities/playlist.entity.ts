import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PlaylistVideo } from './playlist-video.entity';

export enum PlaylistVisibility {
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
  PRIVATE = 'private',
}

export enum SystemPlaylistType {
  LIKED_VIDEOS = 'liked_videos',
  WATCH_LATER = 'watch_later',
  FAVORITES = 'favorites',
}

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PlaylistVisibility,
    default: PlaylistVisibility.PUBLIC,
  })
  visibility: PlaylistVisibility;

  @Column({ default: false })
  isSystemPlaylist: boolean;

  @Column({
    type: 'enum',
    enum: SystemPlaylistType,
    nullable: true,
  })
  systemPlaylistType: SystemPlaylistType;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'int', default: 0 })
  videosCount: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => PlaylistVideo, playlistVideo => playlistVideo.playlist)
  playlistVideos: PlaylistVideo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
