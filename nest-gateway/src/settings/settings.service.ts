import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
    updateName():string {
        return "Update name";
    }

    changePassword():string {
        return "Change password";
    }

    restorePassword():string {
        return "Restore password";
    }
}
