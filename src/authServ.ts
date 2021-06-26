import redis from "redis";
import register from "./auth/register";
import login from "./auth/login";
import postFunc from "./auth/post";

let publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "login":
                try {
                    let result = await login(messageParse.message);
                    post("resLogin", result);
                } catch (e) {
                    post("resLogin", null, e.message);
                }
                break;
            case "register":
                console.log("here2")
                // await register(messageParse, publisher);
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});

subscriber.subscribe('register', 'login');