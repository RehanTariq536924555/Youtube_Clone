import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('views')
@Unique(['userId', 'videoId']) // Prevent duplicate views from same user
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string; // Nullable for anonymous views

  @Column({ type: 'uuid' })
  videoId: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string; // For anonymous view tracking

  @Column({ type: 'int', default: 0 })
  watchTime: number; // In seconds

  @Column({ type: 'boolean', default: false })
  completed: boolean; // If user watched till end

  @ManyToOne(() => User, user => user.views, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Video, video => video.views)
  @JoinColumn({ name: 'videoId' })
  video: Video;

  @CreateDateColumn()
  createdAt: Date;
}