import { Controller, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor (private readonly settingService: SettingsService) {}

    @Put("/updateName")
    updateName(): string {
        return this.settingService.updateName();
    }

    @Put("/changePassword")
    changePassword() {
        return this.settingService.changePassword();
    }

    @Put("/restorePassword")
    restorePassword() {
        return this.settingService.restorePassword();
    }
}
