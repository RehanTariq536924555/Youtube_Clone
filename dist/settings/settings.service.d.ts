import { Repository } from 'typeorm';
import { SiteSetting } from './entities/setting.entity';
export declare class SettingsService {
    private settingsRepository;
    constructor(settingsRepository: Repository<SiteSetting>);
    getAllSettings(): Promise<{}>;
    getSetting(key: string): Promise<string>;
    updateSetting(key: string, value: string): Promise<SiteSetting>;
    updateMultipleSettings(settings: Record<string, string>): Promise<{}>;
}
