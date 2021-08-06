import { Injectable } from '@nestjs/common';
import {getMessageInterface, markReadInterface, sendPhotoInterface} from "../interface/message.interface";
import errorSwitch from "../errorSwitch";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";

@Injectable()
export class MessageService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    getMessage(body: getMessageInterface, res) {
        const id = this.pubSub.subscribe("resGetMessage", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }
            return res.status(200).send(message);
        });

        this.pubSub.publish("getMessage", {
            userId: body._userId_,
            sender: body._userName_,
            chatId: body.chatId,
            start: body.start
        }, id);
    }

    markRead(body: markReadInterface, res) {
        const id = this.pubSub.subscribe("resMarkRead", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            return res.status(200).send(message);
        });

        this.pubSub.publish("markRead", {
            userId: body._userId_,
            sender: body._userName_,
            chatId: body.chatId,
            value: body.value
        }, id);
    }

    sendPhoto(body: sendPhotoInterface) {
        return body;
    }
}
