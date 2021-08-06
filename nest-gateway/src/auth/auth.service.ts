import {BadRequestException, Injectable} from '@nestjs/common';
import {loginInterface, registerInterface, sendCodeInterface} from "../interface/auth.interface";
import errorSwitch from "../errorSwitch";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";
import setToken from "../token/set";

@Injectable()
export class AuthService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    register(body: registerInterface, res) {
        this.send(res, "register", "resRegister", body)
    }

    login(body: loginInterface, res) {
        this.send(res, "login", "resLogin", body)
    }

    sendCode(type: string, body: sendCodeInterface, res) {
        if (type !== "register" && type !== "restore") {
            throw new BadRequestException();
        }

        const id = this.pubSub.subscribe("resSendCodeEmail", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.sendStatus(200);
        });

        this.pubSub.publish("sendCodeEmail", {...body, type: type}, id);
    }

    private send(res, pub:string, sub:string, body:any) {
        let id = this.pubSub.subscribe(sub, (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }
            setToken(res, message);
            return res.end();
        });
        this.pubSub.publish(pub, body, id);
    }
}
