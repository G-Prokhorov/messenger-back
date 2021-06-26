import sanitizer from "sanitizer";
import findUser from "../db/findUser";
import bcrypt from "bcrypt";
import giveToken from "../token/give";
import postFunc from "./post";

export default async function login(obj: any, publisher: any) {
    let username: string;
    let password: string;
    const id = obj.id;
    const message = obj.message;
    console.log(message);
    const post = postFunc(id, "resLogin", publisher);

    if (!message.username || !message.password) {
        post(400);
        return;
    }

    try {
        username = "@" + sanitizer.escape(message.username);
        password = sanitizer.escape(message.password);
    } catch {
        post(400);
        return;
    }

    let result = await findUser(username);

    if (!result) {
        post(404);
        return;
    }


    try {
        let compare = await bcrypt.compare(password, result.getDataValue('password'))
        if (compare) {
            let tokens = await giveToken(username);
            post(200, tokens);
        } else {
            post(401);
        }
    } catch (e) {
        post(500, "Error while login user. " + e);
    }

    return;
}