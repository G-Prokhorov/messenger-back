import checkChat from "../db/checkChat";
import updateNumberMes from "../db/updateNumberMes";
import sequelize from "sequelize";

export default async function markRead(body: any) {
    if (!body.value || !body.chatId || !body.username || !body.userId) {
        throw new Error("Bad request");
    }

    let value: string = body.value, chatId: string = body.chatId, username: string = body.username,  userId: string = body.userId;


    try {
        await checkChat(chatId, userId);
    } catch {
        throw new Error("Forbidden");
    }

    try {
        await updateNumberMes(chatId, userId, sequelize.literal(`"numberOfUnread" + ${value}`), true);
    } catch (e) {
        console.error(e)
        throw new Error("Cannot update chat");
    }
}