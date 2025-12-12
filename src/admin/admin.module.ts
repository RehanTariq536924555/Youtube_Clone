import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController, AdminBootstrapController } from './admin.controller';
import { AdminChannelsController } from './admin-channels.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { User } from '../users/entities/user.entity';
import { Video } from '../videos/entities/video.entity';
import { Comment } from '../comments/entities/comment.entity';
import { View } from '../views/entities/view.entity';
import { Channel } from '../channels/entities/channel.entity';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Video, Comment, View, Channel]),
    ChannelsModule,
  ],
  controllers: [AdminController, AdminBootstrapController, AdminChannelsController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService, AdminGuard],
})
export class AdminModule {}
