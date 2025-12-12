import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(page, limit, search);
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id/ban')
  async banUser(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.banUser(id, reason);
  }

  @Put('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('videos')
  async getAllVideos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllVideos(page, limit, status);
  }

  @Put('videos/:id/feature')
  async featureVideo(@Param('id') id: string) {
    return this.adminService.featureVideo(id);
  }

  @Put('videos/:id/suspend')
  async suspendVideo(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.suspendVideo(id, reason);
  }

  @Put('videos/:id/unsuspend')
  async unsuspendVideo(@Param('id') id: string) {
    return this.adminService.unsuspendVideo(id);
  }

  @Delete('videos/:id')
  async deleteVideo(@Param('id') id: string) {
    return this.adminService.deleteVideo(id);
  }

  @Get('comments')
  async getAllComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getAllComments(page, limit);
  }

  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string) {
    return this.adminService.deleteComment(id);
  }

  @Get('analytics')
  async getAnalytics(@Query('period') period: string = '7d') {
    return this.adminService.getAnalytics(period);
  }

  @Post('users/create-admin')
  async createAdmin(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.createAdmin(name, email, password);
  }

  @Put('users/:id/change-password')
  async changeUserPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.adminService.changeUserPassword(id, newPassword);
  }
}

// Bootstrap controller - no authentication required
@Controller('bootstrap')
export class AdminBootstrapController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-first-admin')
  async createFirstAdmin(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.createFirstAdmin(name, email, password);
  }

  @Post('promote-to-admin')
  async promoteToAdmin(
    @Body('email') email: string,
  ) {
    return this.adminService.promoteUserToAdmin(email);
  }
}
