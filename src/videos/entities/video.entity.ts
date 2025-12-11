import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { View } from '../../views/entities/view.entity';

export enum VideoVisibility {
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
  PRIVATE = 'private'
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: VideoVisibility,
    default: VideoVisibility.PUBLIC
  })
  visibility: VideoVisibility;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  channelId: string;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  dislikesCount: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'int', nullable: true })
  duration: number; // In seconds

  @Column({ type: 'boolean', default: false })
  isShort: boolean; // True if video is 60 seconds or less (YouTube Shorts criteria)

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean; // Admin can feature videos

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean; // Admin can suspend videos

  @Column({ type: 'text', nullable: true })
  suspensionReason: string; // Reason for suspension

  @ManyToOne(() => User, user => user.videos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne('Channel', 'videos', { nullable: true })
  @JoinColumn({ name: 'channelId' })
  channel: any;

  @OneToMany(() => Comment, comment => comment.video)
  comments: Comment[];

  @OneToMany(() => View, view => view.video)
  views: View[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}