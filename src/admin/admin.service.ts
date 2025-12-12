import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Video } from '../videos/entities/video.entity';
import { Comment } from '../comments/entities/comment.entity';
import { View } from '../views/entities/view.entity';
import { Channel } from '../channels/entities/channel.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(View)
    private viewRepository: Repository<View>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalVideos, totalComments, totalViews, totalChannels] =
      await Promise.all([
        this.userRepository.count(),
        this.videoRepository.count(),
        this.commentRepository.count(),
        this.viewRepository.count(),
        this.channelRepository.count(),
      ]);

    const recentUsers = await this.userRepository.count({
      where: {
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) as any,
      },
    });

    const activeChannels = await this.channelRepository.count({
      where: { isActive: true },
    });

    return {
      totalUsers,
      totalVideos,
      totalComments,
      totalViews,
      totalChannels,
      activeChannels,
      recentUsers,
    };
  }

  async getAllUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? { name: Like(`%${search}%`) } : {};

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'isBanned', 'createdAt'],
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const videoCount = user.videos?.length || 0;
    const totalViews = user.videos?.reduce(
      (sum, video) => sum + (video.views || 0),
      0,
    );

    return {
      ...user,
      videoCount,
      totalViews,
    };
  }

  async banUser(id: string, reason: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBanned = true;
    await this.userRepository.save(user);

    return { message: 'User banned successfully', user };
  }

  async unbanUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBanned = false;
    await this.userRepository.save(user);

    return { message: 'User unbanned successfully', user };
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    await this.userRepository.save(user);

    return { message: 'User role updated successfully', user };
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async getAllVideos(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;

    const [videos, total] = await this.videoRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async featureVideo(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    video.isFeatured = !video.isFeatured;
    await this.videoRepository.save(video);

    return { message: 'Video featured status updated', video };
  }

  async suspendVideo(id: string, reason?: string) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    video.isSuspended = true;
    video.suspensionReason = reason || 'Suspended by admin';
    await this.videoRepository.save(video);

    return { message: 'Video suspended successfully', video };
  }

  async unsuspendVideo(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    video.isSuspended = false;
    video.suspensionReason = null;
    await this.videoRepository.save(video);

    return { message: 'Video unsuspended successfully', video };
  }

  async deleteVideo(id: string) {
    const result = await this.videoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Video not found');
    }
    return { message: 'Video deleted successfully' };
  }

  async getAllComments(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'video'],
    });

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteComment(id: string) {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
    return { message: 'Comment deleted successfully' };
  }

  async getAnalytics(period: string) {
    const days = period === '30d' ? 30 : 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const newUsers = await this.userRepository.count({
      where: { createdAt: startDate as any },
    });

    const newVideos = await this.videoRepository.count({
      where: { createdAt: startDate as any },
    });

    return {
      period,
      newUsers,
      newVideos,
    };
  }

  async createAdmin(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new admin user
    const admin = this.userRepository.create({
      name,
      email,
      password, // Will be hashed by @BeforeInsert hook
      role: 'admin',
      isEmailVerified: true,
    });

    await this.userRepository.save(admin);

    return {
      message: 'Admin created successfully',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async changeUserPassword(id: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      message: 'Password changed successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async createFirstAdmin(name: string, email: string, password: string) {
    // Check if any admin user already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      throw new Error('Admin user already exists. Use the regular admin creation endpoint.');
    }

    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      // If user exists but is not admin, update their role
      existingUser.role = 'admin';
      existingUser.isEmailVerified = true;
      if (password) {
        existingUser.password = await bcrypt.hash(password, 10);
      }
      await this.userRepository.save(existingUser);

      return {
        message: 'Existing user promoted to admin successfully',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      };
    }

    // Create new admin user
    const admin = this.userRepository.create({
      name,
      email,
      password, // Will be hashed by @BeforeInsert hook
      role: 'admin',
      isEmailVerified: true,
    });

    await this.userRepository.save(admin);

    return {
      message: 'First admin created successfully',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async promoteUserToAdmin(email: string) {
    // Check if any admin user already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      throw new Error('Admin user already exists. Cannot promote another user.');
    }

    // Find the user to promote
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Promote user to admin
    user.role = 'admin';
    user.isEmailVerified = true; // Ensure email is verified
    await this.userRepository.save(user);

    return {
      message: 'User promoted to admin successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
