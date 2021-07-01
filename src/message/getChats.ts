import findUser from "../db/findUser";
import {sequelize} from "../db/db";
import {QueryTypes} from "sequelize";

export default async function getChats(username: string) {
    console.log(username)
    if (!username) {
        throw new Error("Bad request");
    }

    let user: any;

    try {
        user = await findUser(username);
    } catch (e) {
        throw new Error("Server error");
    }

    if (!user.id) {
        throw new Error("User not exist");
    }

    let chat: any;

    try {
        chat = await sequelize.query(`SELECT id_chat, username FROM chats INNER JOIN users u on u.id = chats.id_user WHERE id_chat in (SELECT id_chat FROM chats WHERE id_user = ` + user.id + `) AND id_user !=` + user.id, {type: QueryTypes.SELECT})
        return chat;
    } catch (e) {
        console.error(e);
        throw new Error("Server error")
    }
}