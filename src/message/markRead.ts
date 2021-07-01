import sanitizer from "sanitizer";
import findUser from "../db/findUser";
import checkChat from "../db/checkChat";
import updateNumberMes from "../db/updateNumberMes";

export default async function markRead(body: any) {
    console.log(body)
    if (!body.value || !body.chatId || !body.username) {
        throw new Error("Bad request");
    }

    let value: string, chatId: string, username: string;

    try {
        value = sanitizer.escape(body.value);
        chatId = sanitizer.escape(body.chatId);
        username = sanitizer.escape(body.username);
    } catch {
        throw new Error("Server error");
    }

    let user;

    try {
        user = await findUser(username);
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
        await updateNumberMes(Number.parseInt(value), chatId, user.id);
    } catch (e) {
        console.error(e)
        throw new Error("Cannot update chat");
    }
}