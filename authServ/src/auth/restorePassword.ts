import {getKey} from "./key";
import updatePassword from "../db/updatePassword";

export default async function restorePassword(body: any) {
    if (!body) {
        throw new Error("Bad request");
    }

    if (!body.password || !body.confirm || !body.key || !body.email) {
        throw new Error("Bad request");
    }

    let password = body.password;
    let confirm = body.confirm;

    if ((password.length > 50) || (password.length < 6) || (password !== confirm)) {
        throw new Error("Password does not meet the requirement");
    }

    let result: any;

    try {
        result = await getKey(body.email);
        result = JSON.parse(result);
    } catch (e) {
        throw new Error(e);
    }

    if (result.code !== body.key || result.type !== "restore") {
        throw new Error("Keys don't match");
    }

    return await updatePassword(password, body.email, true);
}

