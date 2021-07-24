import {chatModel} from "./db";
import {Op} from "sequelize";

export default async function checkChat(chatId: string, userId: string) {
    let checkChat = await chatModel.findAll({
        attribute: ['id_chat', 'id_user'],
        where: {
            [Op.and]: [
                {
                    id_chat: chatId,
                },
                {
                    id_user: userId,
                }
            ]
        }
    });

    if (checkChat.length === 0) {
        throw new Error("Forbidden");
    }

    return checkChat;
}


