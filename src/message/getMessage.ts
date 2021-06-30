import sanitizer from "sanitizer";
import {messageModel} from "../db/db";
import checkChat from "../db/checkChat";
import findUser from "../db/findUser";

export default async function getMessage(body: any) {
    if (!body.start || !body.chatId || !body.sender) {
        throw new Error("Bad request");
    }

    let start: string, chatId: string, sender: string;

    try {
        start = sanitizer.escape(body.start);
        chatId = sanitizer.escape(body.chatId);
        sender = sanitizer.escape(body.sender);
    } catch {
        throw new Error("Server error");
    }

    let user;

    try {
        user = await findUser(sender);
    } catch {
        throw new Error("Server error");
    }

    if (!user.id) {
        throw new Error("User not exist");
    }

    try {
        await checkChat(chatId, user.id);
    } catch {
        throw new Error("Forbidden");
    }

    let messages: any;

    try {
        messages = await messageModel.findAll({
            attributes: ['message'],
            offset: start,
            limit: start + 10,
            order: [['id', 'DESC']],
            where: {
                id_chat: chatId
            }
        });
    } catch (e) {
        console.error(e)
        throw new Error("Server error");
    }

    if (messages.length === 0) {
        throw new Error("Message isn't exist");
    }

    return messages;
}