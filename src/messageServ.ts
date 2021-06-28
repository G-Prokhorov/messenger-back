import redis from "redis";
import postFunc from "./auth/post";
import createChat from "./message/createChat";

const publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "createChat":
                try {
                    let res = await createChat(messageParse.message.users);
                    post("resCreateChat", res);
                } catch (e) {
                    post("resCreateChat", null, e.message)
                }
                break;
        }
    } catch (e) {
        console.error("Error in message microservice. ", + e)
    }
});

subscriber.subscribe('createChat');
