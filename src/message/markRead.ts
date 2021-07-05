import findUser from "../db/findUser";
import checkChat from "../db/checkChat";
import updateNumberMes from "../db/updateNumberMes";

export default async function markRead(body: any) {
    console.log(body)
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
        await updateNumberMes(Number.parseInt(value), chatId, userId, true);
    } catch (e) {
        console.error(e)
        throw new Error("Cannot update chat");
    }
}