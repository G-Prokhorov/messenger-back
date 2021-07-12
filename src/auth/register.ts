import bcrypt from "bcrypt";
import {userModel} from "../db/db";
import redis from "redis";
import giveToken from "../token/give";
import {Op} from "sequelize";

const client = redis.createClient();

export default async function register(body: any) {
    const saltRounds = 10;
    let username: string;
    let password: string;
    let confirm: string;
    let key: string;
    let email: string;

    if (!body.username || !body.password || !body.confirm || !body.key || !body.email) {
        throw new Error("Bad request");
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$");

    if (!re.test(String(body.username))) {
        throw new Error("User must not include special characters");
    }

    username = "@" + body.username;
    password = body.password;
    confirm = body.confirm;
    email = body.email;
    key = body.key;

    let result: any;

    try {
        result = await new Promise((resolve, reject) => client.get(email, (err, data) => {
            if (err) {
                return reject("Server error")
            }

            if (!data) {
                return reject("Key not exist");
            }

            resolve(data);
        }));
        result = JSON.parse(result);
    } catch (e) {
        throw new Error(e);
    }

    if (result.code !== key || result.type !== "register") {
        throw new Error("Keys don't match");
    }

    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        throw new Error("Password does not meet the requirement");
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
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
    }  catch (err) {
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