import redis from "redis";
import register from "./auth/register";
import login from "./auth/login";

let publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message',  async (channel:string, message:string) => {
    try {
        let messageParse = JSON.parse(message);
        switch (channel) {
            case "login":
                console.log("here1")
                await login(messageParse, publisher);
                break;
            case "register":
                console.log("here2")
                await register(messageParse, publisher);
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});

subscriber.subscribe('register', 'login');