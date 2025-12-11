import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../admin/guards/admin.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Public endpoint - anyone can get settings
  @Get()
  async getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    const value = await this.settingsService.getSetting(key);
    return { key, value };
  }

  // Admin only - update settings
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put()
  async updateSettings(@Body() settings: Record<string, string>) {
    return this.settingsService.updateMultipleSettings(settings);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':key')
  async updateSetting(
    @Param('key') key: string,
    @Body('value') value: string,
  ) {
    const setting = await this.settingsService.updateSetting(key, value);
    return { message: 'Setting updated successfully', setting };
  }
}
