import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum LikeType {
  LIKE = 'like',
  DISLIKE = 'dislike'
}

export enum LikeableType {
  VIDEO = 'video',
  COMMENT = 'comment'
}

@Entity('likes')
@Unique(['userId', 'targetId', 'targetType'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  targetId: string; // Can be video ID or comment ID

  @Column({
    type: 'enum',
    enum: LikeableType
  })
  targetType: LikeableType;

  @Column({
    type: 'enum',
    enum: LikeType
  })
  type: LikeType;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}