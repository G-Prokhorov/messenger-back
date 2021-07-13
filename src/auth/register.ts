import bcrypt from "bcrypt";
import {userModel} from "../db/db";
import redis from "redis";
import giveToken from "../token/give";
import {Op} from "sequelize";
import cryptPassword from "./cryptPassword";
import {getKey} from "./key";

const client = redis.createClient();

export default async function register(body: any) {
    if (!body.username || !body.password || !body.confirm || !body.key || !body.email) {
        throw new Error("Bad request");
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$");

    if (!re.test(String(body.username))) {
        throw new Error("User must not include special characters");
    }

    let username: string = "@" + body.username;
    let password: string = body.password;
    let confirm: string = body.confirm;
    let key: string = body.key;
    let email: string = body.email;

    let result: any;

    try {
        result = await getKey(email);
        result = JSON.parse(result);
    } catch (e) {
        throw new Error(e);
    }

    if (result.code !== key || result.type !== "register") {
        throw new Error("Keys don't match");
    }

    if ((username.length > 31) || (password.length > 50) || (password.length < 6) || (password !== confirm)) {
        throw new Error("Password does not meet the requirement");
    }

    try {

        const hash = await cryptPassword(password);
        let result = await userModel.findOrCreate({
            where: {
                [Op.or]: [
                    {
                        username: username,
                    },
                    {
                        email: email,
                    }
                ]
            },
            defaults: {
                username: username,
                password: hash,
                email: email,
            },
        });

        if (!result.pop()) {
            throw "User exist";
        }
    } catch (err) {
        if (err === "User exist") {
            throw new Error("User exist");
        }
        console.error("Error while register new user. " + err);
        throw new Error("Server error");
    }

    client.del(email);

    try {
        return await giveToken(username);
    } catch (e) {
        throw new Error("Server error");
    }
}