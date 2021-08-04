import {Injectable} from '@nestjs/common';
import {changeNameInterface, changePasswordInterface, restorePasswordInterface} from "../interface/settings.interface";
import lib_PubSub from "../my_library/lib_PubSub";
import librarySingleton from "../my_library/librarySingleton";
import errorSwitch from "../errorSwitch";


@Injectable()
export class SettingsService {
    private pubSub: lib_PubSub = librarySingleton.getInstance();

    updateName(body: changeNameInterface, res) {
        const id = this.pubSub.subscribe("resUpdateName", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }
            return res.sendStatus(200);
        });

        this.pubSub.publish("updateName", {
            userId: body._userId_,
            name: body.name,
        }, id);
        return body;
    }

    changePassword(body:changePasswordInterface, res) {
        const id = this.pubSub.subscribe("resChangePassword", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.sendStatus(200);
        });

        this.pubSub.publish("changePassword", {
            username: body._userName_,
            oldPass: body.oldPass,
            password: body.password,
            confirm: body.confirm,
        }, id);
    }

    restorePassword(body: restorePasswordInterface, res) {
        const id = this.pubSub.subscribe("resRestorePassword", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
            }

            return res.sendStatus(200);
        });

        this.pubSub.publish("restorePassword", body, id);
    }
}
