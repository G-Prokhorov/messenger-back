import {chatModel} from "./db";
import sequelize, {Op} from "sequelize";

export default async function updateNumberMes(value: number, chatId: string, userId: string, self: boolean = false) {
    return await chatModel.update({
        numberOfUnread: sequelize.literal(`"numberOfUnread" + ${value}`),
    }, {
        where: {
            [Op.and]: [
                {
                    id_chat: chatId,
                },
                {
                    id_user: self ? userId : {[Op.not]: userId}
                }
            ]
        },
        returning: true,
    });
}