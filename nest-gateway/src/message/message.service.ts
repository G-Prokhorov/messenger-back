import { Injectable } from '@nestjs/common';
import {getMessageInterface, markReadInterface, sendPhotoInterface} from "../interface/message.interface";
import errorSwitch from "../errorSwitch";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";
import reqUserInterface from "../interface/reqUser.interface";

@Injectable()
export class MessageService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    getMessage(body: getMessageInterface, userInfo: reqUserInterface, res) {
        const id = this.pubSub.subscribe("resGetMessage", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }
            return res.status(200).send(message);
        });

        this.pubSub.publish("getMessage", {
            userId: userInfo._userId_,
            sender: userInfo._userName_,
            chatId: body.chatId,
            start: body.start
        }, id);
    }

    markRead(body: markReadInterface, userInfo: reqUserInterface, res) {
        const id = this.pubSub.subscribe("resMarkRead", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.status(200).send(message);
        });

        this.pubSub.publish("markRead", {
            userId: userInfo._userId_,
            username: userInfo._userName_,
            chatId: body.chatId,
            value: body.value
        }, id);
    }

    sendPhoto(body: sendPhotoInterface, userInfo: reqUserInterface, files: Array<Express.Multer.File>, res) {
        const id = this.pubSub.subscribe("resSendPhoto", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.sendStatus(200);
        });
        console.log(body, userInfo, files)
        this.pubSub.publish("sendPhoto", {
            userId: userInfo._userId_,
            username: userInfo._userName_,
            name: userInfo._u_name_,
            chatId: body.chatId,
            files: {...files},
        }, id);
    }
}
