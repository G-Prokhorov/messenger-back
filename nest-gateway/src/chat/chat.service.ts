import { Injectable } from '@nestjs/common';
import {createChatInterface, getChatInterface} from "../interface/chat.interface";

@Injectable()
export class ChatService {
    getChat(body: getChatInterface) {
        return body;
    }

    createChat(body: createChatInterface) {
        return body;
    }
}
