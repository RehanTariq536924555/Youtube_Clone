import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('subscriptions')
@Unique(['subscriberId', 'channelId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  subscriberId: string; // User who is subscribing

  @Column({ type: 'uuid' })
  channelId: string; // User being subscribed to (channel owner)

  @Column({ type: 'boolean', default: true })
  notificationsEnabled: boolean;

  @ManyToOne(() => User, user => user.subscriptions)
  @JoinColumn({ name: 'subscriberId' })
  subscriber: User;

  @ManyToOne(() => User, user => user.subscribers)
  @JoinColumn({ name: 'channelId' })
  channel: User;

  @CreateDateColumn()
  createdAt: Date;
}