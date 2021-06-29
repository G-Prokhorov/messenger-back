import redis from "redis";
import postFunc from "./auth/post";
import createChat from "./message/createChat";
import sendMessage from "./message/sendMessage";
import sanitizer from "sanitizer";

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
            case "sendMessage":

                try {
                    await sendMessage(messageParse.message);
                } catch (e) {
                    try {
                        let user = sanitizer.escape(messageParse.message.sender);
                        post(user, null, e.message);
                    } catch (e) {
                        console.error(e);
                    }
                }
        }
    } catch (e) {
        console.error("Error in message microservice. ", +e)
    }
});

subscriber.subscribe('createChat', 'sendMessage');
