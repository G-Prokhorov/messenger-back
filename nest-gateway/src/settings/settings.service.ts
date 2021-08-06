import {Injectable} from '@nestjs/common';
import {changeNameInterface, changePasswordInterface, restorePasswordInterface} from "../interface/settings.interface";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";
import errorSwitch from "../errorSwitch";
import reqUserInterface from "../interface/reqUser.interface";


@Injectable()
export class SettingsService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    updateName(body: changeNameInterface, userInfo: reqUserInterface, res) {
        const id = this.pubSub.subscribe("resUpdateName", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }
            return res.sendStatus(200);
        });

        this.pubSub.publish("updateName", {
            userId: userInfo._userId_,
            name: body.name,
        }, id);
        return body;
    }

    changePassword(body:changePasswordInterface, userInfo: reqUserInterface, res) {
        const id = this.pubSub.subscribe("resChangePassword", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.sendStatus(200);
        });

        this.pubSub.publish("changePassword", {
            username: userInfo._userName_,
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
