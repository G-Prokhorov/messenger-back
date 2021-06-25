import sanitizer from "sanitizer";
import bcrypt from "bcrypt";
import UserModel from "../db/user_db";

import giveToken from "../token/give";

export default async function register(obj: any, publisher: any) {
    let userModel = UserModel();
    const saltRounds = 10;
    let username: string;
    let password: string;
    let confirm: string;
    const id = obj.id;
    const message = obj.message;

    function post(status: number, messagePost: any = "nothing") {
        publisher.publish("resRegister", JSON.stringify({
            id: id,
            message: {
                status: status,
                message: messagePost,
            }
        }));
    }

    if (!message.username || !message.password || !message.confirm) {
        post(400);
        return;
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$")

    if (!re.test(String(message.username))) {
        post(403, "Password must not include special characters");
        return;
    }

    try {
        username = "@" + sanitizer.escape(message.username);
        password = sanitizer.escape(message.password);
        confirm = sanitizer.escape(message.confirm);
    } catch {
        post(400);
        return;
    }

    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        post(403);
        return;
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        let result = await userModel.findOrCreate({
            where: {
                username: username,
            },
            defaults: {
                password: hash,
            },
        });

        if (!result.pop()) {
            post(409);
            return;
        }
    } catch (err) {
        post(500, "Error while register new user, " + err);
        return;
    }

    try {
        let tokens = await giveToken(username);
        post(200, tokens);
    } catch (e) {
        post(500, e)
    }
    return;
}