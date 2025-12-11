import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAllSettings(): Promise<{}>;
    getSetting(key: string): Promise<{
        key: string;
        value: string;
    }>;
    updateSettings(settings: Record<string, string>): Promise<{}>;
    updateSetting(key: string, value: string): Promise<{
        message: string;
        setting: import("./entities/setting.entity").SiteSetting;
    }>;
}
