import findUser from "../db/findUser";
import bcrypt from "bcrypt";
import giveToken from "../token/give";

export default async function login(body: any) {
    let username: string;
    let password: string;

    if (!body.username || !body.password) {
        throw new Error("Bad request");
    }

    username = "@" + body.username;
    password = body.password;
    let result: any;

    try {
        result = await findUser(username);
    } catch (e) {
        throw new Error("Server error")
    }

    if (!result) {
        throw new Error("User not found");
    }

    try {
        let compare = await bcrypt.compare(password, result.getDataValue('password'))
        if (compare) {
            return await giveToken(username);
        } else {
            throw new Error();
        }
    } catch (e) {
        throw new Error("Incorrect password");
    }
}