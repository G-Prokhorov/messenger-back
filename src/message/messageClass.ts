import createChat from "./createChat";
import sendMessage from "./sendMessage";
import sanitizer from "sanitizer";
import markRead from "./markRead";
import getMessage from "./getMessage";
import getChats from "./getChats";

export default class MessageClass {
    public async createChat(messageParse: any, post: any) {
        try {
            let res = await createChat(messageParse.message.users, messageParse.message.creator);
            post("resCreateChat", res);
        } catch (e) {
            post("resCreateChat", null, e.message)
        }
    }

    public async sendMessage(messageParse: any, post: any, publisher: any) {
        try {
            let users = await sendMessage(messageParse.message);
            users.forEach((value: any) => {
                publisher.publish(value.username, JSON.stringify({
                    err: "success",
                    message: {
                        message: messageParse.message,
                    }
                }));
            });
        } catch (e) {
            try {
                let user = sanitizer.escape(messageParse.message.sender);
                post(user, null, e.message);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public async getMessage(messageParse: any, post: any) {
        try {
            let messages = await getMessage(messageParse.message);
            post("resGetMessage", messages);
        } catch (e) {
            post("resGetMessage", null, e.message);
        }
    }

    public  async markRead(messageParse: any, post: any) {
        try {
            await markRead(messageParse.message);
            post("resMarkRead", "Okay");
        } catch (e) {
            post("resMarkRead", null, e.message);
        }
    }

    public  async getChats(messageParse: any, post: any) {
        console.log(messageParse)
        try {
            let chats = await getChats(messageParse.message.username, messageParse.message.userId);
            post("resGetChats", chats);
        } catch (e) {
            console.error(e.message);
            post("resGetChats", null, e.message);
        }
    }
}