import findUser from "../db/findUser";
import {chatModel, messageModel, sequelize, userModel} from "../db/db";
import {QueryTypes} from "sequelize";

export default async function getChats(username: string, userId: string) {
    if (!username || !userId) {
        throw new Error("Bad request");
    }

    let chat: any;

    try {
        chat = await sequelize.query(`SELECT chats.id_chat, u.username, u.name, m.name  AS sender_name, m.username AS sender_username, m.message,  num."numberOfUnread", COALESCE(m."updatedAt", chats."updatedAt") AS lastUpdate FROM chats INNER JOIN users u on u.id = chats.id_user LEFT JOIN
    (SELECT id_chat, message, username, name, messages."updatedAt" FROM messages INNER JOIN users u on u.id = messages.id_sender WHERE messages.id in (SELECT MAX(id) FROM messages GROUP BY id_chat)) m
        on chats.id_chat = m.id_chat INNER JOIN (SELECT id_chat, "numberOfUnread" FROM chats WHERE id_user =${userId}) num on num.id_chat = chats.id_chat WHERE id_user !=${userId}`, {type: QueryTypes.SELECT})
        return chat;
    } catch (e) {
        console.error(e);
        throw new Error("Server error");
    }
}