import findUser from "../db/findUser";
import sanitizer from "sanitizer";
import {messageModel, userModel} from "../db/db";
import sequelize, {Op} from "sequelize";
import updateNumberMes from "../db/updateNumberMes";


export async function sendMessageWithSanitizer(body: any) {
    if (!body.message || !body.sender || !body.chatId) {
        throw new Error("Bad request");
    }

    let sender: string, message: string, chatId: string;

    try {
        sender = sanitizer.escape(body.sender);
        message = sanitizer.escape(body.message);
        chatId = sanitizer.escape(body.chatId);
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

    return sendMessage(user.id, chatId, message);
}

export async function sendMessage(userId: string, chatId: string, message: string, img:boolean = false) {
    let chat;
    try {
        chat = await updateNumberMes(chatId, userId, 0, true);
    } catch {
        throw new Error("Forbidden");
    }

    if (chat[1].length === 0) {
        throw new Error("Forbidden");
    }

    try {
        await messageModel.create({
            message: message,
            id_sender: userId,
            id_chat: chatId,
            img: img,
        });
    } catch {
        throw new Error("Cannot create message");
    }

    let updated: any;

    try {
        updated = await updateNumberMes(chatId, userId, sequelize.literal(`"numberOfUnread" + 1`));
    } catch (e) {
        console.error(e)
        throw new Error("Cannot update chat");
    }
    try {
        let updatedID = updated[1].map((elemt: any) => {
            if (elemt) {
                return {
                    id: elemt.id_user
                };
            }
        });

        let users: any = await userModel.findAll({
            where: {
                [Op.or]: updatedID,
            },
            attribute: ["username"]
        });

        return users;
    } catch (e) {
        console.error(e)
        throw new Error("Users are not notified");
    }
}