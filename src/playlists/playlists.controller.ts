import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoToPlaylistDto } from './dto/add-video-to-playlist.dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  // Create new playlist
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.create(req.user.id, createPlaylistDto);
  }

  // Get all playlists for current user
  @Get('my-playlists')
  @UseGuards(JwtAuthGuard)
  getMyPlaylists(@Request() req) {
    return this.playlistsService.findByUser(req.user.id);
  }

  // Get public playlists
  @Get('public')
  getPublicPlaylists(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.playlistsService.findPublicPlaylists(+page, +limit);
  }

  // Get single playlist
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPlaylist(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.playlistsService.findOne(id, userId);
  }

  // Update playlist
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(id, req.user.id, updatePlaylistDto);
  }

  // Delete playlist
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.playlistsService.remove(id, req.user.id);
  }

  // Add video to playlist
  @Post(':id/videos')
  @UseGuards(JwtAuthGuard)
  addVideo(
    @Param('id') id: string,
    @Request() req,
    @Body() addVideoDto: AddVideoToPlaylistDto,
  ) {
    return this.playlistsService.addVideo(
      id,
      addVideoDto.videoId,
      req.user.id,
      addVideoDto.position,
    );
  }

  // Remove video from playlist
  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard)
  removeVideo(
    @Param('id') id: string,
    @Param('videoId') videoId: string,
    @Request() req,
  ) {
    return this.playlistsService.removeVideo(id, videoId, req.user.id);
  }
}
