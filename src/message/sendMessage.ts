import findUser from "../db/findUser";
import sanitizer from "sanitizer";
import {chatModel, messageModel, userModel} from "../db/db";
import sequelize, {Op} from "sequelize";
import redis from "redis";

const publisher = redis.createClient();

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

    if (!sender || !message || !chatId) {
        throw new Error("Bad request");
    }

    let user;

    try {
        user = await findUser(body.sender);
    } catch {
        throw new Error("Server error");
    }

    if (!user.id) {
        throw new Error("User not exist");
    }

    try {
        let checkChat = await chatModel.findAll({
            attribute: ['id_chat', 'id_user'],
            where: {
                [Op.and]: [
                    {
                        id_chat: chatId,
                    },
                    {
                        id_user: user.id,
                    }
                ]
            }
        });

        if (checkChat.length === 0) {
            throw new Error("Forbidden");
        }
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
        updated = await chatModel.update({
            read: false,
            numberOfUnread: sequelize.literal("\"numberOfUnread\" + 1"),
        }, {
            where: {
                [Op.and]: [
                    {
                        id_chat: chatId,
                    },
                    {
                        id_user: {[Op.not]: user.id}
                    }
                ]
            },
            returning: true,
        });
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

        let users = await userModel.findAll({
            where: {
                [Op.or]: updatedID,
            },
            attribute: ["username"]
        });

        users.forEach((value: any) => {
            publisher.publish(value.username, JSON.stringify({
                err: "success",
                message: {
                    message: message,
                    chatId: chatId,
                }
            }));
        });
    } catch {
        throw new Error("Users are not notified");
    }


    return;
}