import redis from "redis";
import postFunc from "./auth/post";

const publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "createChat":

                break;
        }
    } catch (e) {
        console.error("Error in message microservice. ", + e)
    }
});

subscriber.subscribe('createChat');
