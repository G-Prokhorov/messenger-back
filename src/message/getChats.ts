import findUser from "../db/findUser";
import {sequelize} from "../db/db";
import {QueryTypes} from "sequelize";

export default async function getChats(username: string, userId: string) {
    if (!username || !userId) {
        throw new Error("Bad request");
    }

    let chat: any;

    try {
        chat = await sequelize.query(`SELECT id_chat, name, "numberOfUnread" FROM chats INNER JOIN users u on u.id = chats.id_user WHERE id_chat in (SELECT id_chat FROM chats WHERE id_user = ` + userId + `) AND id_user !=` + userId, {type: QueryTypes.SELECT})
        return chat;
    } catch (e) {
        console.error(e);
        throw new Error("Server error");
    }
}