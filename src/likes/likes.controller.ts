import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikeableType } from './entities/like.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Body() createLikeDto: CreateLikeDto, @Request() req) {
    return this.likesService.toggleLike(createLikeDto, req.user.id);
  }

  @Get('user/:targetId')
  @UseGuards(JwtAuthGuard)
  async getUserLike(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: LikeableType,
    @Request() req,
  ) {
    return this.likesService.getUserLike(req.user.id, targetId, targetType);
  }

  @Get('stats/:targetId')
  async getTargetLikes(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: LikeableType,
  ) {
    return this.likesService.getTargetLikes(targetId, targetType);
  }
}