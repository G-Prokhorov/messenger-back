import {chatModel} from "./db";
import {Op} from "sequelize";

export default async function updateNumberMes(chatId: string, userId: string, num: any, self: boolean = false) {
    return await chatModel.update({
        numberOfUnread: num,
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