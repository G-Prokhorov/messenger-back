import {messageModel, userModel} from "../db/db";
import checkChat from "../db/checkChat";

export default async function getMessage(body: any) {
    if (!body) {
        throw new Error("Bad request");
    }

    if (!body.start || !body.chatId || !body.sender || !body.userId) {
        throw new Error("Bad request");
    }

    let start: string = body.start, chatId: string = body.chatId, sender: string = body.sender, userId: string = body.userId;

    try {
        await checkChat(chatId, userId);
    } catch (e) {
        console.error(e)
        throw new Error("Forbidden");
    }

    let messages: any;

    try {
        messages = await messageModel.findAll({
            attributes: ['message', 'img'],
            offset: start,
            limit: body.limit || 25,
            order: [['id', 'DESC']],
            where: {
                id_chat: chatId
            },
            include: {
                model: userModel,
                attributes: ['username']
            },
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