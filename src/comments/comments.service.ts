import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      userId,
    });

    return this.commentsRepository.save(comment);
  }

  async findByVideo(videoId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { videoId, parentId: null }, // Only top-level comments
      relations: ['user', 'replies', 'replies.user'],
      select: {
        id: true,
        content: true,
        userId: true,
        videoId: true,
        parentId: true,
        likesCount: true,
        dislikesCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        replies: {
          id: true,
          content: true,
          userId: true,
          videoId: true,
          parentId: true,
          likesCount: true,
          dislikesCount: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { parentId },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        userId: true,
        videoId: true,
        parentId: true,
        likesCount: true,
        dislikesCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'replies'],
      select: {
        id: true,
        content: true,
        userId: true,
        videoId: true,
        parentId: true,
        likesCount: true,
        dislikesCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
        replies: {
          id: true,
          content: true,
          userId: true,
          videoId: true,
          parentId: true,
          likesCount: true,
          dislikesCount: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
  }

  async incrementLikes(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.likesCount++;
    return this.commentsRepository.save(comment);
  }

  async decrementLikes(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.likesCount = Math.max(0, comment.likesCount - 1);
    return this.commentsRepository.save(comment);
  }

  async incrementDislikes(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.dislikesCount++;
    return this.commentsRepository.save(comment);
  }

  async decrementDislikes(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.dislikesCount = Math.max(0, comment.dislikesCount - 1);
    return this.commentsRepository.save(comment);
  }
}