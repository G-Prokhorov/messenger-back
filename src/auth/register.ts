import sanitizer from "sanitizer";
import bcrypt from "bcrypt";
import {userModel} from "../db/db";

import giveToken from "../token/give";

export default async function register(body: any) {
    const saltRounds = 10;
    let username: string;
    let password: string;
    let confirm: string;

    if (!body.username || !body.password || !body.confirm) {
        throw new Error("Bad request");
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$")

    if (!re.test(String(body.username))) {
        throw new Error("User must not include special characters");
    }

    try {
        username = "@" + sanitizer.escape(body.username);
        password = sanitizer.escape(body.password);
        confirm = sanitizer.escape(body.confirm);
    } catch {
        throw new Error("Bad request");
    }

    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        throw new Error("Password does not meet the requirement");
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
            throw "User exist";
        }
    }  catch (err) {
        if (err === "User exist") {
            throw new Error("User exist");
        }
        throw new Error("Server error");
    }

    try {
        return await giveToken(username);
    } catch (e) {
        throw new Error("Server error");
    }
}