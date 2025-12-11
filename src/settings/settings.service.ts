import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private settingsRepository: Repository<SiteSetting>,
  ) {}

  async getAllSettings() {
    const settings = await this.settingsRepository.find();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    
    return settingsObj;
  }

  async getSetting(key: string): Promise<string> {
    const setting = await this.settingsRepository.findOne({
      where: { setting_key: key },
    });
    
    if (!setting) {
      throw new NotFoundException(`Setting ${key} not found`);
    }
    
    return setting.setting_value;
  }

  async updateSetting(key: string, value: string) {
    const setting = await this.settingsRepository.findOne({
      where: { setting_key: key },
    });
    
    if (!setting) {
      // Create new setting
      const newSetting = this.settingsRepository.create({
        setting_key: key,
        setting_value: value,
      });
      await this.settingsRepository.save(newSetting);
      return newSetting;
    }
    
    setting.setting_value = value;
    await this.settingsRepository.save(setting);
    
    return setting;
  }

  async updateMultipleSettings(settings: Record<string, string>) {
    const promises = Object.entries(settings).map(([key, value]) =>
      this.updateSetting(key, value),
    );
    
    await Promise.all(promises);
    
    return this.getAllSettings();
  }
}
