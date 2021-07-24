import {userModel} from "./db";
import redis from "redis";

const client = redis.createClient(6379, process.env.REDIS_HOST);

export default async function findUser(username: string) {
    let user: any;
    try {
        user = await new Promise((resolve, reject) => {
            client.get(username, (err, data) => {
                if (err) {
                    console.error("Error while get username from redis. " + err);
                    reject();
                }

                if (!data) {
                    reject();
                }

                resolve(JSON.parse(data));
            });
        });
        client.expire(username, 60 * 10);
    } catch (e) {
        console.log("Go to db");
        user = await userModel.findOne({
            where: {
                username: username,
            },
        });
        client.set(username, JSON.stringify(user), "EX", 60 * 10, (err) => {
            if (err) {
                console.error("Error while get username from redis. " + err);
            }
        });
    }

    return user;
}