import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(req.user.id, createChannelDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    return this.channelsService.findAll(+page, +limit, search);
  }

  @Get('my-channels')
  @UseGuards(JwtAuthGuard)
  findMyChannels(@Request() req) {
    return this.channelsService.findByUser(req.user.id);
  }

  @Get('my-channels/count')
  @UseGuards(JwtAuthGuard)
  getMyChannelCount(@Request() req) {
    return this.channelsService.getUserChannelCount(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Get('handle/:handle')
  findByHandle(@Param('handle') handle: string) {
    return this.channelsService.findByHandle(handle);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Request() req, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, req.user.id, updateChannelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.channelsService.remove(id, req.user.id);
  }
}
