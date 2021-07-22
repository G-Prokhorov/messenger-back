import createChat from "./createChat";
import {sendMessageWithSanitizer} from "./sendMessage";
import sanitizer from "sanitizer";
import markRead from "./markRead";
import getMessage from "./getMessage";
import getChats from "./getChats";
import sendPhoto from "./sendFile";

export default class MessageClass {
    public static async createChat(messageParse: any, post: any) {
        try {
            let res = await createChat(messageParse.message.users, messageParse.message.creator);
            post("resCreateChat", res);
        } catch (e) {
            post("resCreateChat", null, e.message)
        }
    }

    public static async sendMessage(messageParse: any, post: any) {
        try {
            let users = await sendMessageWithSanitizer(messageParse.message);
            users.forEach((value: any) => {
                post(value.username, messageParse.message);
            });
            let user = sanitizer.escape(messageParse.message.sender);
            post(user, messageParse.message);

        } catch (e) {
            try {
                let user = sanitizer.escape(messageParse.message.sender);
                post(user, null, e.message);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public static async getMessage(messageParse: any, post: any) {
        try {
            let messages = await getMessage(messageParse.message);
            post("resGetMessage", messages);
        } catch (e) {
            post("resGetMessage", null, e.message);
        }
    }

    public static async markRead(messageParse: any, post: any) {
        try {
            await markRead(messageParse.message);
            post("resMarkRead", "Okay");
        } catch (e) {
            post("resMarkRead", null, e.message);
        }
    }

    public static async getChats(messageParse: any, post: any) {
        try {
            let chats = await getChats(messageParse.message.username, messageParse.message.userId);
            post("resGetChats", chats);
        } catch (e) {
            console.error(e.message);
            post("resGetChats", null, e.message);
        }
    }

    public static async sendPhoto(messageParse: any, post: any, publisher: any) {
        try {
            let result = await sendPhoto(messageParse.message);
            result.forEach((elmt: any) => {
                elmt.users.forEach((value: any) => {
                    publisher.publish(value.username, JSON.stringify({
                        err: "success",
                        message: JSON.stringify(elmt.message),
                        id: -1
                    }));
                })
            });
            post("resSendPhoto");
        } catch (e) {
            console.error(e.message);
            post("resSendPhoto", null, e.message);
        }
    }
}