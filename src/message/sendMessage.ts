import findUser from "../db/findUser";
import sanitizer from "sanitizer";
import { messageModel, userModel} from "../db/db";
import {Op} from "sequelize";
import checkChat from "../db/checkChat";
import updateNumberMes from "../db/updateNumberMes";


export default async function sendMessage(body: any) {
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

    try {
        await checkChat(chatId, user.id);
    } catch {
        throw new Error("Forbidden");
    }

    try {
        await messageModel.create({
            message: message,
            id_sender: user.id,
            id_chat: chatId,
        });
    } catch {
        throw new Error("Cannot create message");
    }

    let updated: any;

    try {
        updated = await updateNumberMes(1, chatId, user.id);
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
    } catch {
        throw new Error("Users are not notified");
    }
}