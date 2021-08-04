import {ForbiddenException, Injectable} from '@nestjs/common';
import {restorePasswordInterface} from "../interface/settings.interface";
import lib_PubSub from "../my_library/lib_PubSub";
import librarySingleton from "../my_library/librarySingleton";
import errorSwitch from "../errorSwitch";


@Injectable()
export class SettingsService {
    private pubSub: lib_PubSub = librarySingleton.getInstance();

    updateName():string {
        return "Update name";
    }

    changePassword():string {
        return "Change password";
    }

    restorePassword(body: restorePasswordInterface, res) {
        const id = this.pubSub.subscribe("resRestorePassword", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
            }

            return "Ok";
        });

        this.pubSub.publish("restorePassword", body, id);
    }
}
