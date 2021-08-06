import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {createChatInterface} from "../interface/chat.interface";
import errorSwitch from "../errorSwitch";
import lib_PubSub from "../my_library/lib_PubSub";
import libraryInstance from "../my_library/libraryInstance";
import reqUserInterface from "../interface/reqUser.interface";

@Injectable()
export class ChatService {
    private pubSub: lib_PubSub = libraryInstance.getInstance();

    getChat(userInfo: reqUserInterface, res) {
        const id = this.pubSub.subscribe("resGetChats", async (err: string, message: string) => {
            if (err !== 'success') {
                errorSwitch(res, err);
                return;
            }

            res.status(200).send(message);
            return;
        });
        this.pubSub.publish("getChats", {
            userId: userInfo._userId_,
            username: userInfo._userName_,
        }, id);
    }

    createChat(body: createChatInterface, userInfo: reqUserInterface, res) {
        let users: Array<string>;
        try {
            if (Array.isArray(body.users)) {
                users = body.users
            } else {
                users = JSON.parse(body.users)
            }
        } catch (e) {
            console.error("Error while parse array. " + e)
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
            creator: userInfo._userName_,
        }, id);
    }
}
