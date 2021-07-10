import redis from "redis";
import postFunc from "./post";
import MessageClass from "./message/messageClass";

const publisher = redis.createClient();
const subscriber = redis.createClient();
const M = new MessageClass();

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "createChat":
                await M.createChat(messageParse, post);
                break;
            case "sendMessage":
                await M.sendMessage(messageParse, post, publisher);
                break;
            case "getMessage":
                await M.getMessage(messageParse, post);
                break;
            case "markRead":
                await M.markRead(messageParse, post);
                break;
            case "getChats":
                await M.getChats(messageParse, post);
                break;
            case "sendPhoto":
                await M.sendPhoto(messageParse, post);
                break;
        }
    } catch (e) {
        console.error("Error in message microservice. ", +e)
    }
});

subscriber.subscribe('createChat', 'sendMessage', 'getMessage', 'markRead', 'getChats', 'sendPhoto');
