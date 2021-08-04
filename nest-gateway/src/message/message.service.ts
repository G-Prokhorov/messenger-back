import { Injectable } from '@nestjs/common';
import {getMessageInterface, markReadInterface, sendPhotoInterface} from "../interface/message.interface";

@Injectable()
export class MessageService {
    getMessage(body: getMessageInterface) {
        return body;
    }

    markRead(body: markReadInterface) {
        return body;
    }

    sendPhoto(body: sendPhotoInterface) {
        return body;
    }
}
