import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {createChatInterface, getChatInterface} from "../interface/chat.interface";
import errorSwitch from "../errorSwitch";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";

@Injectable()
export class ChatService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    getChat(body: getChatInterface, res) {
        const id = this.pubSub.subscribe("resGetChats", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            res.status(200).send(message);
            return;
        });

        this.pubSub.publish("getChats", {
            userId: body._userId_,
            username: body._userName_,
        }, id);
    }

    createChat(body: createChatInterface, res) {
        let users
        try {
            users = JSON.parse(body.users)
        } catch {
            throw new InternalServerErrorException();
        }
        const id = this.pubSub.subscribe("resCreateChat", (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            if (message) {
                res.status(200).send(message);
                return;
            }

            res.sendStatus(200);
            return;
        });

        this.pubSub.publish("createChat", {
            users: users,
            creator: body._userName_,
        }, id);
    }
}
