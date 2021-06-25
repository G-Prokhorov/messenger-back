import redis from "redis";
import register from "./auth/register";

let publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message',  async (channel:string, message:string) => {
    try {
        let messageParse = JSON.parse(message);
        switch (channel) {
            case "login":
                break;
            case "register":
                await register(messageParse, publisher);
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});

subscriber.subscribe('register');